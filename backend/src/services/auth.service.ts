// src/services/auth.service.ts
import { pbkdf2Sync } from 'crypto';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

interface TokenResponse {
  token: string;
  refreshToken: string;
}

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const parts = hashedPassword.split('$');
  const iterations = parts[1];
  const salt = parts[2];
  const hash = parts[3];

  const derivedKey = pbkdf2Sync(password, salt, parseInt(iterations), 32, 'sha256').toString('base64');
  return hash === derivedKey;
};

export const generateToken = (email: string): string => {
  const secretKey = process.env.SECRET_KEY || 'tu_secreto';
  return jwt.sign({ email }, secretKey, { expiresIn: '1h' });
};

