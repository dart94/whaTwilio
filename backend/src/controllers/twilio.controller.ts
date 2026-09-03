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

// ✅ FUNCIÓN CORREGIDA
export async function getTemplateDetails(
  accountSid: string,
  authToken: string,
  templateId: string
): Promise<TwilioTemplate> {
  // ✅ CAMBIO: ContentTemplates → Content
  const url = `https://content.twilio.com/v1/Content/${templateId}`;
  
  try {
    const response = await axios.get<TwilioTemplateResponse>(url, {
      auth: {
        username: accountSid,
        password: authToken
      }
    });
    
    const template = response.data;
    
    // ✅ Buscar en AMBOS tipos
    let body = '';
    let templateType: 'twilio/text' | 'twilio/quick-reply' = 'twilio/text';
    
    if (template?.types?.['twilio/quick-reply']?.body) {
      body = template.types['twilio/quick-reply'].body;
      templateType = 'twilio/quick-reply';
    } else if (template?.types?.['twilio/text']?.body) {
      body = template.types['twilio/text'].body;
      templateType = 'twilio/text';
    }
    
    return {
      friendly_name: template.friendly_name,
      body,
      variables: template.variables || {},
      type: templateType
    };
  } catch (error: any) {
    console.error("❌ Error al obtener plantilla desde Twilio API:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ NUEVO: Función para obtener todas las plantillas CON sus bodies
export async function getAllTemplatesWithBody(
  accountSid: string,
  authToken: string
): Promise<TwilioTemplate[]> {
  try {
    const allTemplates = await getContentTemplates(accountSid, authToken);
    
    const templatesWithBody = await Promise.all(
      allTemplates.map(async (template): Promise<TwilioTemplate> => {
        try {
          const details = await getTemplateDetails(accountSid, authToken, template.sid);
          return {
            friendly_name: details.friendly_name,
            body: details.body,
            variables: details.variables,
            type: details.type
          };
        } catch (error) {
          console.error(`Error: ${template.sid}`, error);
          return {
            friendly_name: template.friendly_name,
            body: '',
            variables: {},
            type: 'twilio/text' as const
          };
        }
      })
    );
    
    return templatesWithBody;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}