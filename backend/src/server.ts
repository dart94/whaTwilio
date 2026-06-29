import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authenticateToken } from '../middlewares/auth.middleware';
import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaign.routes';
import numberPhonesRoutes from './routes/numberPhones.routes';
import subAccountRoutes from './routes/subAccounts.routes';
import credentialRoutes from './routes/credential.routes';
import templateRoutes from './routes/templates.routes';
import sheetRoutes from './routes/sheet.routes';
import massiveRoutes from './routes/massive.routes';
import MonitorTwilioRoutes from './routes/monitorTwilio.routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim().replace(/\/$/, ''));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Protege todas las rutas /api excepto POST /login
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/login' && req.method === 'POST') return next();
  authenticateToken(req, res, next);
});

app.use('/api/', authRoutes);
app.use('/api', subAccountRoutes);
app.use('/api/', campaignRoutes);
app.use('/api/', numberPhonesRoutes);
app.use('/api/', credentialRoutes);
app.use('/api/', templateRoutes);
app.use('/api/', sheetRoutes);
app.use('/api/', massiveRoutes);
app.use('/api/', MonitorTwilioRoutes);

// TEMP: show actual table names in Railway DB
app.get('/api/debug/tables', async (_req, res) => {
  try {
    const { connection } = await import('./config/db.config');
    const [rows] = await connection.query('SHOW TABLES');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado en puerto ${port}`);
});
