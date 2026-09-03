import {
  getTemplateDetails,
  getTemplateStatus,
  getFullTemplateInfo,
  getAllTemplates
} from './twilioTemplates.Service';

// ============================================
// CONFIGURACIÓN
// ============================================

const ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const AUTH_TOKEN = 'tu_auth_token_aqui';

const TEMPLATES = {
  conQuickReply: 'HX4d79c1c5d095405c84da37269f410edf', // _cita_carroceria3
  conText: 'HX9e3c14b1206d4ea9afc55ffcef0f3f1f'        // pagopendienteok
};

// ============================================
// TESTS
// ============================================

async function runTests() {
  console.log('🧪 EJECUTANDO TESTS\n');
  
  try {
    // TEST 1: Obtener plantilla con quick-reply
    console.log('📋 TEST 1: Plantilla con twilio/quick-reply');
    console.log('━'.repeat(70));
    const template1 = await getTemplateDetails(
      ACCOUNT_SID,
      AUTH_TOKEN,
      TEMPLATES.conQuickReply
    );
    console.log(`✅ Nombre: ${template1.friendly_name}`);
    console.log(`✅ Tipo: ${template1.type}`);
    console.log(`✅ Body: ${template1.body.substring(0, 60)}...`);
    console.log(`✅ Variables: ${Object.keys(template1.variables).length}`);
    console.log('');
    
    // TEST 2: Obtener plantilla con text
    console.log('📋 TEST 2: Plantilla con twilio/text');
    console.log('━'.repeat(70));
    const template2 = await getTemplateDetails(
      ACCOUNT_SID,
      AUTH_TOKEN,
      TEMPLATES.conText
    );
    console.log(`✅ Nombre: ${template2.friendly_name}`);
    console.log(`✅ Tipo: ${template2.type}`);
    console.log(`✅ Body: ${template2.body.substring(0, 60)}...`);
    console.log(`✅ Variables: ${Object.keys(template2.variables).length}`);
    console.log('');
    
    // TEST 3: Status de aprobación
    console.log('📋 TEST 3: Status de aprobación');
    console.log('━'.repeat(70));
    const status = await getTemplateStatus(
      ACCOUNT_SID,
      AUTH_TOKEN,
      TEMPLATES.conText
    );
    console.log(`✅ Status: ${status.status}`);
    console.log(`✅ Categoría: ${status.category}`);
    console.log('');
    
    // TEST 4: Info completa
    console.log('📋 TEST 4: Información completa');
    console.log('━'.repeat(70));
    const full = await getFullTemplateInfo(
      ACCOUNT_SID,
      AUTH_TOKEN,
      TEMPLATES.conText
    );
    console.log(`✅ Nombre: ${full.friendly_name}`);
    console.log(`✅ Status: ${full.status}`);
    console.log(`✅ Categoría: ${full.category}`);
    console.log(`✅ Body: ${full.body.substring(0, 60)}...`);
    console.log('');
    
    // TEST 5: Todas las plantillas
    console.log('📋 TEST 5: Todas las plantillas');
    console.log('━'.repeat(70));
    const all = await getAllTemplates(ACCOUNT_SID, AUTH_TOKEN);
    console.log(`✅ Total de plantillas: ${all.length}`);
    console.log('');
    
    console.log('✅ ¡TODOS LOS TESTS PASARON!');
  } catch (error) {
    console.error('❌ Error en tests:', error);
  }
}

// Ejecutar
runTests();