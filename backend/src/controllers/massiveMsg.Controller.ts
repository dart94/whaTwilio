import { Request, Response } from 'express';
import { runMassiveMsg } from '../services/massiveMsg.service';

export const runMassiveMsgHandler = async (req: Request, res: Response) => {
    try {
      console.log('📥 Body recibido en el controlador:', req.body);
      await runMassiveMsg(req.body); 
      res.status(200).json({ message: 'Mensajes enviados correctamente' });
    } catch (error) {
      console.error('❌ Error en el controlador:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };