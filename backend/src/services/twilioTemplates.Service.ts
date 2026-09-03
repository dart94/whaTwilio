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
    
    // 🔍 LOGS DE DEBUG
    console.log('=== DEBUG LOGS ===');
    console.log('📦 Response data:', JSON.stringify(template, null, 2));
    console.log('🔑 Keys del objeto:', Object.keys(template));
    console.log('📝 Tiene types?:', !!template.types);
    console.log('📋 Keys de types:', template.types ? Object.keys(template.types) : 'NO TIENE');
    console.log('✓ Quick-reply?:', !!template.types?.['twilio/quick-reply']);
    console.log('✓ Text?:', !!template.types?.['twilio/text']);
    console.log('=== FIN DEBUG ===\n');
    
    // ✅ Buscar en AMBOS tipos
    let body = '';
    let templateType: 'twilio/text' | 'twilio/quick-reply' = 'twilio/text';
    
    if (template.types?.['twilio/quick-reply']?.body) {
      body = template.types['twilio/quick-reply'].body;
      templateType = 'twilio/quick-reply';
      console.log('✅ Encontró quick-reply');
    } else if (template.types?.['twilio/text']?.body) {
      body = template.types['twilio/text'].body;
      templateType = 'twilio/text';
      console.log('✅ Encontró text');
    } else {
      console.log('❌ NO encontró body en ninguno');
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