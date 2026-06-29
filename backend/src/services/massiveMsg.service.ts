import { getHeaders, getData, updateData } from "../services/sheets.Service";
import { sendMessage } from "../services/twilio.Service";
import { updateJob } from "../services/jobStore";

type CamposTemplate = { [key: string]: string };

interface MsgParams {
  spreadsheetId: string;
  sheetName: string;
  rangeA: string;
  rangeB: string;
  templateSid: string;
  camposTemp: CamposTemplate;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioSenderNumber: string;
}

interface RowData {
  [key: string]: string;
  Lista_Negra: string;
  Whatsapp: string;
  Celular: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const BATCH_WRITE_SIZE = 10;
const SEND_DELAY_MS = 200;

export const runMassiveMsg = async (params: MsgParams, jobId: string): Promise<void> => {
  const {
    spreadsheetId,
    sheetName,
    rangeA,
    rangeB,
    templateSid,
    camposTemp,
    twilioAccountSid,
    twilioAuthToken,
    twilioSenderNumber,
  } = params;

  if (!rangeA || !rangeB) throw new Error("El rango inicial o final no está definido.");

  const fullRange = `${sheetName}!${rangeA}:${rangeB}`;
  const headers = await getHeaders(spreadsheetId, sheetName);
  const values = await getData(spreadsheetId, fullRange);

  if (!values.length) {
    updateJob(jobId, { status: 'done', total: 0, message: 'Sin filas para procesar.' });
    return;
  }

  const data: RowData[] = values.map((row: string[]) => {
    const obj: RowData = { Lista_Negra: "", Whatsapp: "", Celular: "" };
    headers.forEach((header: string, i: number) => { obj[header] = row[i] ?? ""; });
    return obj;
  });

  const eligibles = data.filter(
    row => row["Lista_Negra"]?.toUpperCase() !== "LISTA_NEGRA" && row["Whatsapp"]?.toUpperCase() === "ENVIAR"
  ).length;

  updateJob(jobId, { total: eligibles });

  let sent = 0;
  let errors = 0;
  let processed = 0;

  const flushToSheets = async () => {
    const updatedValues = data.map(row => headers.map((h: string) => row[h] ?? ""));
    await updateData(spreadsheetId, fullRange, updatedValues);
  };

  for (const row of data) {
    if (row["Lista_Negra"]?.toUpperCase() === "LISTA_NEGRA") continue;
    if (row["Whatsapp"]?.toUpperCase() !== "ENVIAR") continue;

    const replacements: { [key: string]: string } = {};
    for (let i = 1; i <= 20; i++) {
      const campo = camposTemp[i.toString()];
      replacements[i.toString()] = campo ? row[campo] || "" : "";
    }

    const numero = `whatsapp:+521${row["Celular"]}`.trim();

    try {
      await sendMessage(numero, templateSid, replacements, twilioSenderNumber, twilioAccountSid, twilioAuthToken);
      row["Whatsapp"] = "Enviado";
      sent++;
    } catch (err: any) {
      row["Whatsapp"] = "Error";
      errors++;
      console.error(`Error enviando a ${numero}:`, err?.message || err);
    }

    processed++;
    updateJob(jobId, { processed, sent, errors });

    if (processed % BATCH_WRITE_SIZE === 0) {
      await flushToSheets().catch(e => console.error('Error al escribir batch en Sheets:', e));
    }

    await delay(SEND_DELAY_MS);
  }

  await flushToSheets();
  updateJob(jobId, { status: 'done', processed, sent, errors });
};
