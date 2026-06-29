import { Router } from 'express';
import { runMassiveMsgHandler, getJobStatusHandler } from '../controllers/massiveMsg.Controller';

const router = Router();

router.post('/massive', runMassiveMsgHandler);
router.get('/massive/status/:jobId', getJobStatusHandler);

export default router;
