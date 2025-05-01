import { BASE_URL } from "../config/apiConfig";



export const getTwilioLogs = async (accountSid: string, authToken: string) => {
    const res = await fetch(`${BASE_URL}/api/twilio/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountSid, authToken }),
    });
  
    if (!res.ok) throw new Error("Error al obtener los logs de Twilio");
    return res.json();
  };
  