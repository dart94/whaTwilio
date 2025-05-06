import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

let credentials: any;

if (process.env.NODE_ENV === 'production') {
  if (!process.env.GOOGLE_KEYS) {
    throw new Error('GOOGLE_KEYS no está definida en entorno de producción.');
  }
  credentials = JSON.parse(process.env.GOOGLE_KEYS);
} else {
  const credentialsPath = path.resolve(__dirname, 'credencialesAI.json');
  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`No se encontró el archivo de credenciales en ${credentialsPath}`);
  }
  credentials = require(credentialsPath);
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const cliSheets = google.sheets({ version: 'v4', auth });
