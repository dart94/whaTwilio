import { BASE_URL } from "../config/apiConfig";

export interface MassiveData {
  spreadsheetId: string;
  sheetName: string;
  rangeA: string;
  rangeB: string;
  templateSid: string;
  camposTemp: CamposTemplate;
}

interface CamposTemplate {
  [key: string]: string;
}

//Función para enviar masivos

export async function sendMassive(requestBody: MassiveData) {
    try {
      const response = await fetch(`${BASE_URL}/api/massive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("📥 Datos recibidos:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al enviar los datos:", error);
      throw error;
    }
  }
  

