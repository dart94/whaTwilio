import { Router } from 'express';
import { getCampaigns,
        getCampaignsBySubAccount,
        createCampaign
        } from '../controllers/campaigns.controller';

const router = Router();

// Ruta para crear campaña
router.post('/campaigns', createCampaign);

// Ruta para obtener campañas
router.get('/campaigns', getCampaigns);

// Ruta para obtener campañas por ID de subcuenta
router.get('/campaigns/sub_account/:sub_account_id', getCampaignsBySubAccount);

export default router;