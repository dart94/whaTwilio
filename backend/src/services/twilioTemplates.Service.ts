import axios from 'axios';

// ============================================
// TIPOS
// ============================================

interface TwilioTemplate {
  friendly_name: string;
  body: string;
  variables: Record<string, any>;
  language: string;
  type: 'twilio/text' | 'twilio/quick-reply';
}

interface TwilioTemplateResponse {
  friendly_name: string;
  language: string;
  variables?: Record<string, any>;
  types?: {
    'twilio/text'?: { body: string };
    'twilio/quick-reply'?: { 
      body: string;
      actions?: Array<{ id: string; title: string }>;
    };
    [key: string]: any;
  };
}

// ============================================
// FUNCIONES
// ============================================

/**
 * Obtener detalles de UNA plantilla (con body)
 * Funciona con twilio/text Y twilio/quick-reply
 */
export async function getTemplateDetails(
  accountSid: string,
  authToken: string,
  templateId: string
): Promise<TwilioTemplate> {
  const url = `https://content.twilio.com/v1/Content/${templateId}`;
  
  try {
    const response = await axios.get<TwilioTemplateResponse>(url, {
      auth: { username: accountSid, password: authToken }
    });
    
    const template = response.data;
    
    // ✅ Buscar en AMBOS tipos
    let body = '';
    let templateType: 'twilio/text' | 'twilio/quick-reply' = 'twilio/text';
    
    if (template.types?.['twilio/quick-reply']?.body) {
      body = template.types['twilio/quick-reply'].body;
      templateType = 'twilio/quick-reply';
    } else if (template.types?.['twilio/text']?.body) {
      body = template.types['twilio/text'].body;
      templateType = 'twilio/text';
    }
    
    return {
      friendly_name: template.friendly_name,
      body,
      variables: template.variables || {},
      language: template.language || 'es_MX',
      type: templateType
    };
  } catch (error: any) {
    console.error('❌ Error al obtener plantilla:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Obtener el status de aprobación
 */
export async function getTemplateStatus(
  accountSid: string,
  authToken: string,
  templateId: string
): Promise<{
  status: string;
  category: string;
  rejection_reason?: string;
}> {
  const url = `https://content.twilio.com/v1/Content/${templateId}/ApprovalRequests`;
  
  try {
    const response = await axios.get(url, {
      auth: { username: accountSid, password: authToken }
    });
    
    const approval = response.data.whatsapp;
    
    return {
      status: approval?.status || 'unknown',
      category: approval?.category || 'UNKNOWN',
      rejection_reason: approval?.rejection_reason || ''
    };
  } catch (error: any) {
    console.error('❌ Error al obtener status:', error.message);
    throw error;
  }
}

/**
 * Obtener TODO: detalles + status
 */
export async function getFullTemplateInfo(
  accountSid: string,
  authToken: string,
  templateId: string
): Promise<TwilioTemplate & { status: string; category: string }> {
  const [details, approval] = await Promise.all([
    getTemplateDetails(accountSid, authToken, templateId),
    getTemplateStatus(accountSid, authToken, templateId)
  ]);
  
  return {
    ...details,
    status: approval.status,
    category: approval.category
  };
}

/**
 * Obtener TODAS las plantillas
 */
export async function getAllTemplates(
  accountSid: string,
  authToken: string
): Promise<any[]> {
  const url = 'https://content.twilio.com/v1/Content';
  
  try {
    const response = await axios.get<{ contents: any[] }>(url, {
      auth: { username: accountSid, password: authToken }
    });
    
    return response.data.contents;
  } catch (error: any) {
    console.error('❌ Error al obtener plantillas:', error.message);
    throw error;
  }
}