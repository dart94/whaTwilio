import { randomUUID } from 'crypto';

export interface MassiveJob {
  id: string;
  status: 'running' | 'done' | 'error';
  total: number;
  processed: number;
  sent: number;
  errors: number;
  message?: string;
  startedAt: Date;
}

const jobs = new Map<string, MassiveJob>();

export function createJob(): MassiveJob {
  const job: MassiveJob = {
    id: randomUUID(),
    status: 'running',
    total: 0,
    processed: 0,
    sent: 0,
    errors: 0,
    startedAt: new Date(),
  };
  jobs.set(job.id, job);
  setTimeout(() => jobs.delete(job.id), 2 * 60 * 60 * 1000);
  return job;
}

export function getJob(id: string): MassiveJob | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, updates: Partial<MassiveJob>): void {
  const job = jobs.get(id);
  if (job) jobs.set(id, { ...job, ...updates });
}
