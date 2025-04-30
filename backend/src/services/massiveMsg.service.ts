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
  twilioSenderNumber: string; // O puedes usar messagingServiceSid si aplica
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

    console.log("🚀 Iniciando envío masivo...");

    if (!rangeA || !rangeB) {
      throw new Error("El rango inicial o final no está definido.");
    }

    const fullRange = `${nameFromCampaign}!${rangeA}:${rangeB}`;
    console.log("🔍 Rango completo para consulta:", fullRange);

    const headers = await getHeaders(sidFromCampaign, nameFromCampaign);
    console.log("📋 Encabezados:", headers);

    const values = await getData(sidFromCampaign, fullRange);
    console.log(`📊 Se obtuvieron ${values.length} registros`);

    if (!values.length) {
      console.warn("⚠️ No se encontraron datos en el rango especificado.");
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
      console.log(`\n➡️ Procesando fila ${index + 1}:`, row);

      if (row["Lista_Negra"] === "ListaNegra") {
        console.log("⛔ Contacto en lista negra. Se omite.");
        continue;
      }

      if (row["Whatsapp"]?.toUpperCase() !== "ENVIAR") {
        console.log(`❌ Fila ignorada. Valor de Whatsapp: \"${row["Whatsapp"]}\"`);
        continue;
      }

      console.log(`➡️ Enviando mensaje ${index + 1} de ${data.length}...`);

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

        console.log(`✅ Mensaje enviado a ${numero}: ${mensaje.sid}`);
        row["Whatsapp"] = "Enviado";
        enviados++;
      } catch (err) {
        console.error(`❌ Error al enviar a ${numero}:"`, err);
        row["Whatsapp"] = "Error";
        errores++;
      }
    }

    const updatedValues = data.map((row) => headers.map((header) => row[header] ?? ""));

    await updateData(sidFromCampaign, fullRange, updatedValues);
    console.log("📥 Datos actualizados en la hoja correctamente.");

    console.log("\n✅ Envío masivo completado.");
    console.log(`📤 Mensajes enviados exitosamente: ${enviados}`);
    console.log(`❌ Errores de envío: ${errores}`);
  } catch (err) {
    console.error("❌ Error general en el proceso:", err);
  }
};
