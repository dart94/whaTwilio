import { getHeaders, getData, updateData } from "../services/sheets.Service";
import { replaceTemplate } from "../utils/templateUtils";
import { sendMessage } from "../services/twilio.Service";
import * as fs from "fs";

type CamposTemplate = { [key: string]: string };

interface MsgParams {
  spreadsheetId: string;
  sheetName: string;
  rangeA: string;
  rangeB: string;
  templateBody: string;
  camposTemp: CamposTemplate;
}

export const runMassiveMsg = async (params: MsgParams) => {
  try {
    const { spreadsheetId, sheetName, rangeA, rangeB, templateBody, camposTemp } = params;

    console.log("🚀 Iniciando envío masivo...");

    // Validar que rangeA y rangeB existan
    if (!rangeA || !rangeB) {
      throw new Error("El rango inicial o final no está definido.");
    }

    const fullRange = `${sheetName}!${rangeA}:${rangeB}`;
    console.log("🔍 Rango completo para consulta:", fullRange);

    // Obtener encabezados
    const headers = await getHeaders(spreadsheetId, sheetName);
    console.log("📋 Encabezados:", headers);

    // Obtener datos del rango
    const values = await getData(spreadsheetId, fullRange);
    console.log(`📊 Se obtuvieron ${values.length} registros`);

    if (!values.length) {
      console.warn("⚠️ No se encontraron datos en el rango especificado.");
      return;
    }

    // Definir estructura de filas
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

    // Procesar fila por fila
    for (const [index, row] of data.entries()) {
      console.log(`\n➡️ Procesando fila ${index + 1}:`, row);

      if (row["Lista_Negra"] === "ListaNegra") {
        console.log("⛔ Contacto en lista negra. Se omite.");
        continue;
      }

      if (row["Whatsapp"]?.toUpperCase() !== "ENVIAR") {
        console.log(`❌ Fila ignorada. Valor de Whatsapp: "${row["Whatsapp"]}"`);
        continue;
      }

      const replacements: { [key: string]: string } = {};
      for (let i = 1; i <= 20; i++) {
        const campo = camposTemp[i.toString()];
        replacements[i.toString()] = campo ? row[campo] || "" : "";
      }

      const mensajeFinal = replaceTemplate(templateBody, replacements);
      console.log("📨 Mensaje generado:", mensajeFinal);

      fs.writeFileSync(`debug_message_${index + 1}.txt`, mensajeFinal, "utf8");

      const numero = `whatsapp:+521${row["Celular"]}`.trim();

      try {
        const mensaje = await sendMessage(numero, mensajeFinal);
        console.log(`✅ Mensaje enviado a ${numero}: ${mensaje.sid}`);
        row["Whatsapp"] = "Enviado";
      } catch (err) {
        console.error(`❌ Error al enviar a ${numero}:`, err);
        row["Whatsapp"] = "Error";
      }
    }

    // Actualizar datos en el mismo rango
    const updatedValues = data.map((row) =>
      headers.map((header) => row[header] ?? "")
    );

    await updateData(spreadsheetId, fullRange, updatedValues);
    console.log("📥 Datos actualizados en la hoja correctamente.");
  } catch (err) {
    console.error("❌ Error general en el proceso:", err);
  }
};
