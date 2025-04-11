import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyPassword, generateToken } from '../services/auth.service';
import { connection } from '../config/db.config';

// Ruta para iniciar sesión
export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  connection.query(query, [email], (err, results: any[]) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ message: 'Error al verificar las credenciales.' });
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      if (verifyPassword(password, user.password)) {
        const token = generateToken(user.email);
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax'
        });
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
      } else {
        res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
      }
    } else {
      res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
    }
  });
};

// Middleware para verificar el token
export const getUserEmail = (req: Request, res: Response): void => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: 'No se proporcionó token.' });
    return;
  }

  const secretKey = process.env.SECRET_KEY || 'tu_secreto';
  interface DecodedToken {
    email: string;
    iat?: number;
    exp?: number;
  }

  jwt.verify(token, secretKey, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      res.status(401).json({ message: 'Token inválido.' });
    } else {
      const decodedToken = decoded as DecodedToken;
      res.status(200).json({ email: decodedToken.email });
    }
  });
};

// GET /api/users
export const users = async (req: Request, res: Response): Promise<void> => {
  try {
    const [results, fields] = await connection.promise().query(`
      SELECT
          id,
          username,
          email,
          first_name,
          last_name,
          is_superuser,
          is_active,
          DATE_FORMAT(date_joined, '%d/%m/%Y, %H:%i:%s') AS date_joined,
          DATE_FORMAT(last_login, '%d/%m/%Y, %H:%i:%s') AS last_login 
      FROM users;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los usuarios.' });
  }
};

// Actualizar usuario por ID
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { username, email, first_name, last_name, is_superuser, is_active } = req.body;

  if (!userId) {
    res.status(400).json({ message: 'ID de usuario es requerido.' });
    return 
  }

  try {
    // Verificar que el usuario existe
    const [userResults] = await connection.promise().query<any[]>('SELECT id FROM users WHERE id = ?', [userId]);

    if (userResults.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return 
    }

    // Actualizar los datos del usuario
    const [result] = await connection.promise().query<any>(`
      UPDATE users
      SET 
        username = ?,
        email = ?,
        first_name = ?,
        last_name = ?,
        is_superuser = ?,
        is_active = ?
      WHERE id = ?
    `, [username, email, first_name, last_name, is_superuser, is_active, userId]);

    if ((result as any).affectedRows === 0) {
      res.status(500).json({ message: 'No se pudo actualizar el usuario.' });
      return 
    }

    res.status(200).json({
      userId: userId
    });
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};