import * as dotenv from 'dotenv';
dotenv.config();

export const GOOGLE_KEYS_FILE = process.env.GOOGLE_KEYS_FILE || 'credenciales.json';
