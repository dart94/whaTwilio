import { BASE_URL } from '../config/apiConfig';

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

//Crear una nueva hoja de cálculo
export async function crearSheet(sheet: Sheet): Promise<Sheet> {
  const response = await fetch(`${BASE_URL}/api/sheets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sheet)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido');
  }

  return response.json();
}

// Obtener una hoja de cálculo por ID de Google Sheets
export async function obtenerSheetPorId(sheet_id: string) {
  const encodedId = encodeURIComponent(sheet_id);
  const response = await fetch(`${BASE_URL}/api/sheets/${encodedId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

