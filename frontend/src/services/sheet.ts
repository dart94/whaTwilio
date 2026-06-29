import { apiFetch } from '../utils/apiFetch';

export interface Sheet {
  id: number;
  sheet_id: string;
  sheet_sheet: string;
  sheet_range: string;
  field_blacklist: string;
  field_status: string;
  field_contact: string;
  campaign_id: number;
  created_at: string;
  updated_at: string;
}

export async function crearSheet(sheet: Sheet): Promise<Sheet> {
  const response = await apiFetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sheet),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido');
  }
  return response.json();
}

export async function obtenerSheetPorId(sheet_id: string) {
  const response = await apiFetch(`/api/sheets/${encodeURIComponent(sheet_id)}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function obtenerHeadersPorGoogleSheetId(googleSheetId: string, sheetName?: string) {
  const queryParams = sheetName ? `?sheetName=${encodeURIComponent(sheetName)}` : '';
  const response = await apiFetch(`/api/sheets/google/${encodeURIComponent(googleSheetId)}/headers${queryParams}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function obtenerSheetsPorCampaign(campaign_id: number) {
  const response = await apiFetch(`/api/sheets/campaign/${campaign_id}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
