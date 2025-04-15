import { Router } from 'express';
import { getSheetHeadersById, getSheetsByCampaign, addSheet, getSheetById, getHeadersByGoogleSheetId } from '../controllers/sheet.controller';

const router = Router();

// Ruta para obtener todas las hojas de cálculo
router.get('/sheets/:id/headers', getSheetHeadersById);

// Ruta para obtener hojas de cálculo por campaña
router.get('/sheets/campaign/:campaign_id', getSheetsByCampaign);

// Ruta para agregar una nueva hoja de cálculo
router.post('/sheets', addSheet);

// Ruta para obtener hojas de cálculo por ID
router.get('/sheets/:sheetID', getSheetById);

// Ruta para obtener los encabezados de una hoja de cálculo
router.get('/sheets/google/:googleSheetId/headers', getHeadersByGoogleSheetId);


export default router;

