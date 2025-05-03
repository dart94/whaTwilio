// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: { is_staff: number }; // Adjust the type of 'user' as needed
    }
  }
}
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


export const checkStaff = (allowed: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Asegúrate de tener el usuario decodificado (JWT)

    if (!user || user.is_staff !== (allowed ? 1 : 0)) {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    next();
  };
};