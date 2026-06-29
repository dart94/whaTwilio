import { Request, Response } from 'express';
import { runMassiveMsg } from '../services/massiveMsg.service';
import { createJob, getJob, updateJob } from '../services/jobStore';

export const runMassiveMsgHandler = async (req: Request, res: Response): Promise<void> => {
  const job = createJob();
  res.status(202).json({ jobId: job.id, message: 'Envío iniciado' });

  runMassiveMsg(req.body, job.id).catch(err => {
    console.error('Error en envío masivo:', err);
    updateJob(job.id, { status: 'error', message: err?.message || 'Error desconocido' });
  });
};

export const getJobStatusHandler = (req: Request, res: Response): void => {
  const job = getJob(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: 'Job no encontrado o expirado' });
    return;
  }
  res.json(job);
};
