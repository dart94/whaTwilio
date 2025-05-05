import axios from 'axios';

export async function getContentTemplates(accountSid: string, authToken: string) {
  const url = 'https://content.twilio.com/v1/Content';
  
  try {
    const response = await axios.get<{ contents: any[] }>(url, {
      auth: { username: accountSid, password: authToken }
    });
    return response.data.contents;
  } catch (error) {
    console.error('❌ Error al obtener las plantillas:', error);
    throw error;
  }
}
interface TwilioTemplate {
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

export async function getTemplateDetails(
  accountSid: string,
  authToken: string,
  templateId: string
): Promise<TwilioTemplate> {
  const url = `https://content.twilio.com/v1/ContentTemplates/${templateId}`;
  try {
    const response = await axios.get(url, {
      auth: {
        username: accountSid,
        password: authToken
      }
    });
    
    // Tipifico la respuesta
    const template = response.data as TwilioTemplateResponse;
    
    const body =
      template?.types?.['twilio/quick-reply']?.body || 
      template?.types?.['twilio/text']?.body ||
      '';
      
    return {
      friendly_name: template.friendly_name,
      body,
      variables: template.variables || {}
    };
  } catch (error: any) {
    console.error("❌ Error al obtener plantilla desde Twilio API:", error.response?.data || error.message);
    throw error;
  }
}