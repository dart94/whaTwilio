import { Router } from 'express';
import { runMassiveMsgHandler } from '../controllers/massiveMsg.Controller';

const router = Router();


// Ruta para ejecutar el envío masivo de mensajes
router.post('/massive', runMassiveMsgHandler);

export default router;