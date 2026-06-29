import { apiFetch } from '../utils/apiFetch';

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

export async function sendMassive(requestBody: MassiveData) {
  const response = await apiFetch('/api/massive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
