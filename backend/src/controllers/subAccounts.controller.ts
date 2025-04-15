import { Request, Response } from 'express';
import { connection } from '../config/db.config';

export const createSubAccount = async (req: Request, res: Response): Promise<void> => {
  const { email, nombreSubcuenta } = req.body;

  if (!email || !nombreSubcuenta) {
    res.status(400).json({ message: 'Correo electrónico y nombre de subcuenta son requeridos.' });
    return;
  }

  try {
    // Buscar el ID del usuario basado en el correo electrónico
    const [userResults] = await connection.query<any[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (userResults.length === 0) {
      res.status(404).json({ message: 'No se encontró ningún usuario con ese correo electrónico.' });
      return;
    }

    const userId = userResults[0].id;

    // Insertar la nueva subcuenta con el ID del usuario
    const [insertResults] = await connection.query<any>(
      'INSERT INTO sub_accounts (name, created_at, updated_at, user_id) VALUES (?, NOW(), NOW(), ?)',
      [nombreSubcuenta, userId]
    );

    console.log('Subcuenta creada con ID:', insertResults.insertId);
    res.status(201).json({ message: 'Subcuenta creada exitosamente.' });

  } catch (error) {
    console.error('Error al crear la subcuenta:', error);
    res.status(500).json({ message: 'Error al crear la subcuenta.', error: (error as Error).message });
  }
};

// Ruta para obtener subcuentas
export const getSubAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const [results, fields] = await connection.query(`
      SELECT
          id,
          user_id AS Usuario,
          name AS Nombre,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado
      FROM
          sub_accounts;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener las subcuentas.' });
  }
};

// Ruta para obtener subcuentas por ID de usuario
export const getSubAccountsByUserId = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;

  if (!email) {
    res.status(400).json({ message: 'Email es requerido.' });
    return 
  }

  try {
    // Primero obtenemos el ID del usuario
    const [userResults] = await connection.query('SELECT id FROM users WHERE email = ?', [email]) as [any[], any];

    if (userResults.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return 
    }

    const userId = userResults[0].id;

    // Luego obtenemos las subcuentas de ese usuario
    const [results] = await connection.query(`
      SELECT
          id,
          user_id AS Usuario,
          name AS Nombre,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado
      FROM
          sub_accounts
      WHERE
          user_id = ?
    `, [userId]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener las subcuentas del usuario.' });
  }
};

// Ruta para actualizar una subcuenta
export const updateSubAccount = async (req: Request, res: Response): Promise<void> => {
  const subcuentaId = req.params.id;
  const { nombre } = req.body;  // Solo usar el nombre, ignorar el usuario

  if (!subcuentaId) {
    res.status(400).json({ message: 'ID de subcuenta es requerido.' });
    return 
  }

  try {
    // Verificar que la subcuenta existe
    const [subcuentaResults] = await connection.query('SELECT id FROM sub_accounts WHERE id = ?', [subcuentaId]) as [any[], any];

    if (subcuentaResults.length === 0) {
      res.status(404).json({ message: 'Subcuenta no encontrada.' });
      return 
    }

    // Actualizar solo el nombre de la subcuenta
    const [result] = await connection.query<any>(`
      UPDATE sub_accounts
      SET 
        name = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [nombre, subcuentaId] );

    if (result.affectedRows === 0) {
      res.status(500).json({ message: 'No se pudo actualizar la subcuenta.' });
      return 
    }

    res.status(200).json({
      message: 'Subcuenta actualizada exitosamente.',
      subcuentaId: subcuentaId
    });
  } catch (err) {
    console.error('Error al actualizar la subcuenta:', err);
    res.status(500).json({ message: 'Error al actualizar la subcuenta.' });
  }
};
