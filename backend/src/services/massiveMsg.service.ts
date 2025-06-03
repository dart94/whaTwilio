import { getHeaders, getData, updateData } from "../services/sheets.Service";
import { sendMessage } from "../services/twilio.Service";
import * as fs from "fs";

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

export const runMassiveMsg = async (params: MsgParams) => {
  try {
    const {
      spreadsheetId: sidFromCampaign,
      sheetName: nameFromCampaign,
      rangeA,
      rangeB,
      templateSid,
      camposTemp,
      twilioAccountSid,
      twilioAuthToken,
      twilioSenderNumber,
    } = params;

    if (!rangeA || !rangeB) {
      throw new Error("El rango inicial o final no está definido.");
    }

    const fullRange = `${nameFromCampaign}!${rangeA}:${rangeB}`;

    const headers = await getHeaders(sidFromCampaign, nameFromCampaign);

    const values = await getData(sidFromCampaign, fullRange);

    if (!values.length) {
      return;
    }

    interface RowData {
      [key: string]: string;
      Lista_Negra: string;
      Whatsapp: string;
      Celular: string;
    }

    const data: RowData[] = values.map((row: string[]) => {
      const obj: RowData = { Lista_Negra: "", Whatsapp: "", Celular: "" };
      headers.forEach((header: string, i: number) => {
        obj[header] = row[i] ?? "";
      });
      return obj;
    });

    let enviados = 0;
    let errores = 0;

    for (const [index, row] of data.entries()) {


      if (row["Lista_Negra"]?.toUpperCase() === "LISTA_NEGRA") {

        continue;
      }

      if (row["Whatsapp"]?.toUpperCase() !== "ENVIAR") {

        continue;
      }



      const replacements: { [key: string]: string } = {};
      for (let i = 1; i <= 20; i++) {
        const campo = camposTemp[i.toString()];
        replacements[i.toString()] = campo ? row[campo] || "" : "";
      }

      const numero = `whatsapp:+521${row["Celular"]}`.trim();

      try {
        const mensaje = await sendMessage(
          numero,
          templateSid,
          replacements,
          twilioSenderNumber,
          twilioAccountSid,
          twilioAuthToken
        );
        row["Whatsapp"] = "Enviado";
        enviados++;
      } catch (err) {

        row["Whatsapp"] = "Error";
        errores++;
      }
    }

    const updatedValues = data.map((row) => headers.map((header) => row[header] ?? ""));

    await updateData(sidFromCampaign, fullRange, updatedValues);
  } catch (err) {
  }
};
