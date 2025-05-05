import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const credentials = JSON.parse(process.env.GOOGLE_KEYS!); 
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const cliSheets = google.sheets({ version: 'v4', auth });
