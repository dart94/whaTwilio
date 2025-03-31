// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Implementación de verificación JWT
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Verificar rol de administrador
};

export const validateLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Validar estructura de email/password
};