import { apiFetch } from '../utils/apiFetch';

export const getTwilioLogs = async (accountSid: string, authToken: string) => {
  const response = await apiFetch('/api/twilio/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountSid, authToken }),
  });
  if (!response.ok) throw new Error('Error al obtener los logs de Twilio');
  return response.json();
};
