import { Router } from 'express';
import { getTwilioLogs } from '../controllers/monitorTwilio.controller';

const router = Router();

router.post('/twilio/logs', getTwilioLogs);

export default router;