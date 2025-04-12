// frontend/src/services/campaignService.ts
import { BASE_URL } from "../config/apiConfig";

// Interfaz de Campana
export interface CampaignData{
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



//** Crear una campaña */
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
  
  const response = await fetch(`${BASE_URL}/api/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      name: nombre, 
      description: descripcion, 
      sub_account_id, 
      credential_sheet_id, 
      credential_template_id 
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido');
  }
  
  return response.json();
}


//** obtener una campaña */
export async function obtenerCampanas() {
  const response = await fetch(`${BASE_URL}/api/campaigns`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

//** actualizar una campaña */
export async function actualizarCampana(campana: CampaignData) {
  const response = await fetch(`${BASE_URL}/api/campaigns/${campana.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campana)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al actualizar campaña (HTTP ${response.status})`);
  }
  return response.json();
}


