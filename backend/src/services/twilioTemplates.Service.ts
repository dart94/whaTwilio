import axios from 'axios';

interface TwilioTemplate {
  friendly_name: string;
  body: string;
  variables: any;
}

interface TwilioTemplateResponse {
  friendly_name: string;
  language: string;
  variables?: any;
  types?: {
    'twilio/text'?: { body: string };
    'twilio/quick-reply'?: { body: string };
    [key: string]: any;
  };
}

// ✅ FUNCIÓN CORREGIDA
export async function getTemplateDetails(
  accountSid: string,
  authToken: string,
  templateId: string
): Promise<TwilioTemplate> {
  // ✅ AQUÍ CAMBIÓ: ContentTemplates → Content
  const url = `https://content.twilio.com/v1/Content/${templateId}`;
  
  try {
    const response = await axios.get(url, {
      auth: {
        username: accountSid,
        password: authToken
      }
    });
    
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
    console.error(
      "❌ Error al obtener plantilla desde Twilio API:",
      error.response?.data || error.message
    );
    throw error;
  }
}