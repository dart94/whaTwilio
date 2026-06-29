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

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
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

app.listen(port, () => {
  console.log(`Servidor iniciado en puerto ${port}`);
});
