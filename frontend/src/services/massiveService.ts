// Corrigiendo la interfaz de MassiveData para que coincida con el objeto que se está enviando
import { BASE_URL } from "../config/apiConfig";
export interface MassiveData {
  spreadsheetId: string | undefined;
  sheetName: string | undefined;
  rangeA: string;
  rangeB: string;
  templateSid: string | undefined;
  camposTemp: CamposTemplate | undefined;
  twilioAccountSid: string | undefined;
  twilioAuthToken: string | undefined;
  twilioSenderNumber: string;
}
interface CamposTemplate {
  [key: string]: string;
}

// Función para enviar masivos
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
      return data;
    } catch (error) {
      throw error;
    }
  }