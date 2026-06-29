import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { email: string; is_staff: number };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: 'No autenticado.' });
    return;
  }
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ message: 'Error de configuración del servidor.' });
    return;
  }
  jwt.verify(token, secretKey, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
    if (err) {
      res.status(401).json({ message: 'Sesión expirada o inválida.' });
      return;
    }
    req.user = decoded as { email: string; is_staff: number };
    next();
  });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.is_staff !== 1) {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    return;
  }
  next();
};

export const validateLoginInput = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    return;
  }
  next();
};

export const checkStaff = (allowed: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || user.is_staff !== (allowed ? 1 : 0)) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
  };
};
