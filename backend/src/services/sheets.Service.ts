import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const cScope = ['https://www.googleapis.com/auth/spreadsheets'];

let _credentials: any = null;

const getCredentials = () => {
  if (_credentials) return _credentials;

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.GOOGLE_KEYS) throw new Error('GOOGLE_KEYS env var no está definida en producción.');
    _credentials = JSON.parse(process.env.GOOGLE_KEYS);
  } else {
    const credentialsPath = path.resolve(__dirname, '../config/credencialesAI.json');
    if (!fs.existsSync(credentialsPath)) throw new Error(`No se encontró credencialesAI.json en ${credentialsPath}`);
    _credentials = require(credentialsPath);
  }
  return _credentials;
};

const getSheets = () => {
  const auth = new google.auth.GoogleAuth({ credentials: getCredentials(), scopes: cScope });
  return google.sheets({ version: 'v4', auth });
};

export const getHeaders = async (spreadsheetId: string, sheetName: string) => {
  const result = await getSheets().spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!A1:ZZ1` });
  return result.data.values ? result.data.values[0] : [];
};

export const getData = async (spreadsheetId: string, fullRange: string) => {
  const result = await getSheets().spreadsheets.values.get({ spreadsheetId, range: fullRange });
  return result.data.values || [];
};

export const updateData = async (spreadsheetId: string, fullRange: string, values: string[][]) => {
  await getSheets().spreadsheets.values.update({
    spreadsheetId,
    range: fullRange,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
};
