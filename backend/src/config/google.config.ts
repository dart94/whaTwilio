import { google } from 'googleapis';
import { GOOGLE_KEYS_FILE } from './dotenvConfig';

const auth = new google.auth.GoogleAuth({
    keyFile: GOOGLE_KEYS_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const cliSheets = google.sheets({ version: 'v4', auth });
