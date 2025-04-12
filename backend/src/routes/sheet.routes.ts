import { Router } from 'express';
import { getSheetHeadersById, getSheetsByCampaign, addSheet } from '../controllers/sheet.controller';

const router = Router();

// Ruta para obtener todas las hojas de cálculo
router.get('/sheets/:id/headers', getSheetHeadersById);

// Ruta para obtener hojas de cálculo por campaña
router.get('/sheets/campaign/:campaign_id', getSheetsByCampaign);

// Ruta para agregar una nueva hoja de cálculo
router.post('/sheets', addSheet);

export default router;

