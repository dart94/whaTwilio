import Router from 'express';
import { getTemplatesByCampaign,
         getTemplateFields,
         associateFieldsToTemplate,
         getTemplateFieldsByCampaignId,
         getTemplates,
         postTemplates
        } from "../controllers/template.controller";
 
const router = Router();

// Ruta para obtener plantillas asociadas a una campaña
router.get('/templates/campaign/:campaign_id', getTemplatesByCampaign);

// Ruta para obtener los campos de una plantilla específica
router.get('/templates/campaign-fields/:template_id', getTemplateFields);

// Ruta para asociar campos entre plantillas y hojas
router.post('/templates/campaign-fields', associateFieldsToTemplate);

// Ruta para obtener los campos de una plantilla específica por ID de campaña
router.get('/templates/campaign/:campaign_id/fields', getTemplateFieldsByCampaignId);

// Ruta para obtener los campos de una plantilla específica
router.get('/templates', getTemplates);

// Ruta para crear una nueva plantilla
router.post('/templates', postTemplates);

export default router;