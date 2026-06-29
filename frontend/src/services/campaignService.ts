import { apiFetch } from '../utils/apiFetch';

export interface CampaignData {
  id: number;
  Nombre: string;
  Descripción: string;
  Subcuenta: string;
  CredencialTwilio: string;
  CredencialGcp: string;
  Plantillas: string;
  Sheets: string;
  Creado: string;
  Actualizado: string;
}

export async function crearCampana(
  nombre: string,
  descripcion: string,
  sub_account_id: number,
  credential_sheet_id: number,
  credential_template_id: number
) {
  if (!nombre || !descripcion || !sub_account_id) {
    throw new Error('Nombre, descripción y subcuenta son requeridos');
  }

  const response = await apiFetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nombre, description: descripcion, sub_account_id, credential_sheet_id, credential_template_id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido');
  }
  return response.json();
}

export async function obtenerCampanas() {
  const response = await apiFetch('/api/campaigns');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function actualizarCampana(campana: CampaignData) {
  const response = await apiFetch(`/api/campaigns/${campana.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campana),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al actualizar campaña (HTTP ${response.status})`);
  }
  return response.json();
}

export async function obtenerCampanasPorSubcuenta(sub_account_id: number) {
  const response = await apiFetch(`/api/campaigns/sub_account/${sub_account_id}`);
  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  return response.json();
}
