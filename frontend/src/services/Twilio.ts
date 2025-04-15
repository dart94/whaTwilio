import { BASE_URL } from '../config/apiConfig';

export interface TwilioTemplate {
  friendly_name: string;
  body: string;
  variables: any;
}

// Defino una interfaz para la respuesta de la API de Twilio
interface TwilioTemplateResponse {
  friendly_name: string;
  variables?: any;
  types?: {
    'twilio/quick-reply'?: { body: string };
    'twilio/text'?: { body: string };
    [key: string]: any;
  };
}


//Obtener plantillas desde Twilio Content
export async function getContentTemplates(name){
    try{
        const response = await fetch(`${BASE_URL}/api/templates?name=${encodeURIComponent(name)}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error desconocido');
        }

        const templates = await response.json();
        return templates;
    } catch (error) {
        console.error('❌ Error obteniendo plantillas:', error);
        return null
    }
}