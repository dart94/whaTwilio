import { apiFetch } from '../utils/apiFetch';

export interface TemplateData {
  id?: number;
  name: string;
  associated_fields: string[];
  sid: string;
  campaign_id: number;
  created_at?: string;
  updated_at?: string;
}

export async function insertTemplate(template: TemplateData) {
  const response = await apiFetch('/api/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido');
  }
  return response.json();
}

export async function getTemplatesByCampaign(campaign_id: number) {
  const response = await apiFetch(`/api/templates/campaign/${campaign_id}/fields`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
