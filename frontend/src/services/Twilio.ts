import { apiFetch } from '../utils/apiFetch';

export interface TwilioTemplate {
  friendly_name: string;
  body: string;
  variables: any;
  type: 'twilio/text' | 'twilio/quick-reply';
}

interface TwilioTemplateResponse {
  friendly_name: string;
  variables?: any;
  types?: {
    'twilio/quick-reply'?: { body: string };
    'twilio/text'?: { body: string };
    [key: string]: any;
  };
}

export async function getContentTemplates(name: string) {
  try {
    const response = await apiFetch(`/api/templates?name=${encodeURIComponent(name)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error desconocido');
    }
    return response.json();
  } catch (error) {
    console.error('Error obteniendo plantillas:', error);
    return [];
  }
}
