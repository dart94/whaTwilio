import { Request, Response } from 'express';
import { connection } from '../config/db.config';
import { ResultSetHeader } from 'mysql2';

// Obtener todos los números de teléfono
export const getNumberPhones = async (req: Request, res: Response): Promise<void> => {
  try {
    const [results, fields] = await connection.query(`
      SELECT
          id,
          name AS nombre,
          company AS compania,
          number AS numero,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS creado,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS actualizado
      FROM
          number_phones
      ORDER BY
          id DESC;
    `);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los números telefónicos.' });
  }
};

// Obtener todos los números de teléfono formateados
export const getNumberPhonesFormatted = async (req: Request, res: Response): Promise<void> => {
  try {
    const [results, fields] = await connection.query(`
      SELECT
          id,
          name AS nombre,
          company AS compania,
          CONCAT('+52 ', number) AS numero,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS creado,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS actualizado
      FROM
          number_phones
      ORDER BY
          id DESC;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los números telefónicos.' });
  }
};

export const createNumberPhone = async (req: Request, res: Response): Promise<void> => {
  const { name, company, number } = req.body;

  if (!name || !company || !number) {
    res.status(400).json({ message: 'Nombre, compañía y número son requeridos.' });
    return;
  }

  const insertNumberPhoneQuery = `
    INSERT INTO number_phones (name, company, number, created_at, updated_at)
    VALUES (?, ?, ?, NOW(), NOW())
  `;

  try {
    const [result] = await connection.query<ResultSetHeader>(
      insertNumberPhoneQuery,
      [name, company, number]
    );

    res.status(201).json({ message: 'Número telefónico creado exitosamente.' });
  } catch (insertErr) {
    console.error('Error al crear el número telefónico:', insertErr);
    res.status(500).json({ message: 'Error al crear el número telefónico.' });
  }
};


//Asociar números de telefono a una subcuenta
export const associateNumberPhonesToSubAccount = async (req: Request, res: Response): Promise<void> => {
  const { sub_account_id, number_phone_id } = req.body;

  if (!sub_account_id || !number_phone_id) {
    res.status(400).json({ message: 'ID de subcuenta y ID de número telefónico son requeridos.' });
    return 
  }

  try {
    // Verificar que la subcuenta existe
    const [subAccountResults] = await connection.query('SELECT id FROM sub_accounts WHERE id = ?', [sub_account_id]) as any[];

    if (subAccountResults.length === 0) {
      res.status(404).json({ message: 'Subcuenta no encontrada.' });
      return 
    }

    // Verificar que el número telefónico existe
    const [numberPhoneResults] = await connection.query('SELECT id FROM number_phones WHERE id = ?', [number_phone_id]) as any[];

    if (numberPhoneResults.length === 0) {
      res.status(404).json({ message: 'Número telefónico no encontrado.' });
      return 
    }

    // Crear la asociación en la tabla correspondiente (asumiendo que existe una tabla para esta relación)
    const [result] = await connection.query(`
      INSERT INTO sub_account_number_phones (sub_account_id, number_phone_id, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `, [sub_account_id, number_phone_id]);

    res.status(201).json({ message: 'Número telefónico asociado exitosamente a la subcuenta.' });
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al asociar el número telefónico a la subcuenta.' });
  }
};


// Obtener todos los números de teléfono para una subcuenta específica
export const getNumberPhonesBySubAccount = async (req: Request, res: Response): Promise<void> => {
  const { sub_account_id } = req.params;

  if (!sub_account_id) {
    res.status(400).json({ message: 'ID de subcuenta es requerido.' });
    return 
  }

  try {
    const [results] = await connection.query(`
      SELECT
          np.id,
          np.name AS nombre,
          np.company AS compania,
          np.number AS numero,
          DATE_FORMAT(np.created_at, '%d/%m/%Y, %H:%i:%s') AS creado,
          DATE_FORMAT(np.updated_at, '%d/%m/%Y, %H:%i:%s') AS actualizado
      FROM
          number_phones np
      JOIN
          sub_account_number_phones sanp ON np.id = sanp.number_phone_id
      WHERE
          sanp.sub_account_id = ?
    `, [sub_account_id]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los números telefónicos de la subcuenta.' });
  }
};


// Actualizar número de teléfono
export const updateNumberPhone = async (req: Request, res: Response): Promise<void> => {
  const phoneId = req.params.id;
  const { nombre: name, compania: company, numero: number } = req.body;

  if (!name || !company || !number) {
    res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    return;
  }

  try {
    // Verificar que el número telefónico existe
    const [phoneResults] = await connection.query<any[]>('SELECT id FROM number_phones WHERE id = ?', [phoneId] );

    if (phoneResults.length === 0) {
      res.status(404).json({ message: 'Número telefónico no encontrado.' });
      return 
    }

    // Actualizar los datos del número telefónico
    const [result] = await connection.query(`
      UPDATE number_phones
      SET 
        name = ?,
        company = ?,
        number = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [name, company, number, phoneId]);

    if ((result as any).affectedRows === 0) {
      res.status(500).json({ message: 'No se pudo actualizar el número telefónico.' });
      return 
    }

    res.status(200).json({
      message: 'Número telefónico actualizado exitosamente.',
      phoneId: phoneId
    });
  } catch (err) {
    console.error('Error al actualizar el número telefónico:', err);
    res.status(500).json({ message: 'Error al actualizar el número telefónico.' });
  }
};