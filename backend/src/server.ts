import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaign.routes';
import  numberPhonesRoutes from './routes/numberPhones.routes';
import subAccountRoutes from './routes/subAccounts.routes';
import credentialRoutes from './routes/credential.routes';
import templateRoutes from './routes/templates.routes';
import sheetRoutes from './routes/sheet.routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Configuración de CORS y otros middlewares
const corsOptions = {
  origin: '*', // Permitir cualquier origen (solo para desarrollo)
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



// Importar Rutas
app.use('/api/', authRoutes);
app.use('/api', subAccountRoutes);
app.use('/api/', campaignRoutes);
app.use('/api/', numberPhonesRoutes);
app.use('/api/', credentialRoutes);
app.use('/api/', templateRoutes);
app.use('/api/', sheetRoutes);



app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});