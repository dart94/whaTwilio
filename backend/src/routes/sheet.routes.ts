import { Router } from 'express';
import { getSheetHeadersById, getSheetsByCampaign } from '../controllers/sheet.controller';

const router = Router();

// Ruta para obtener todas las hojas de cálculo
router.get('/sheets/:id/headers', getSheetHeadersById);

// Ruta para obtener hojas de cálculo por campaña
router.get('/sheets/campaign/:campaign_id', getSheetsByCampaign);

export default router;

