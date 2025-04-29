import { BASE_URL } from "../config/apiConfig";

// Interfaz de Plantilla
export interface TemplateData {
  id?: number;
  name: string;
  associated_fields: string[];
  sid: string;
  campaign_id: number;
  created_at?: string;
  updated_at?: string;
}

//Función para insertar una plantilla
export async function insertTemplate(template: TemplateData) {
  const response = await fetch(`${BASE_URL}/api/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template)
  });
  
  console.log('✅ Plantilla insertada:', response.status);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido');
  }
  
  return response.json();
}

// Obtener campos asociados por campaña
export async function getTemplatesByCampaign(campaign_id: number) {
  const response = await fetch(`${BASE_URL}/api/templates/campaign/${campaign_id}/fields`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}