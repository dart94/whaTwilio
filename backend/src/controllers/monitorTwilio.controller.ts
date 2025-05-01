// src/controllers/monitorTwilio.controller.ts
import { Request, Response } from 'express';
import { getTwilioLogsService } from '../services/monitorTwilio.service';

export const getTwilioLogs = async (req: Request, res: Response): Promise<void> => {
  const { accountSid, authToken } = req.body;

  if (!accountSid || !authToken) {
    res.status(400).json({ message: 'Faltan credenciales de Twilio.' });
    return;
  }

  try {
    const logs = await getTwilioLogsService({ accountSid, authToken });
    res.status(200).json(logs);
  } catch (error) {
    console.error('❌ Error al obtener logs de Twilio:', error);
    res.status(500).json({ message: 'Error al obtener logs de Twilio.' });
  }
};
