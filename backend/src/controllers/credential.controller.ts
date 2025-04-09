import { connection } from '../config/db.config';
import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';

// Ruta para obtener credenciales
export const getCredentials = async (req: Request, res: Response): Promise<void> => {
    try {
        const [results, fields] = await connection.promise().query(`
          SELECT
              id,
              name,
              json,
              DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS created_at,
              DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS updated_at
          FROM credentials;
        `);
    
        res.status(200).json(results);
      } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ message: 'Error al obtener las credenciales.' });
      }
    };

// Ruta para crear credencial
export const postCredentials = async (req: Request, res: Response): Promise<void> => {
    const { name, json } = req.body;

    if (!name || !json) {
        res.status(400).json({ message: 'Nombre y JSON son requeridos.' });
      return 
    }
  
    const insertCredentialQuery = 'INSERT INTO credentials (name, json, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';
    connection.query(insertCredentialQuery, [name, json], (insertErr, insertResults: ResultSetHeader) => {
      if (insertErr) {
        console.error('Error al crear la credencial:', insertErr);
        return res.status(500).json({ message: 'Error al crear la credencial.' });
      }
  
      console.log('Credencial creada con ID:', insertResults.insertId);
      res.status(201).json({ message: 'Credencial creada exitosamente.' });
    });
  };

// Ruta para asociar las credenciales a una subcuenta
export const associateCredentialsToSubAccount = async (req: Request, res: Response): Promise<void> => {
  const { sub_account_id, credentials_id } = req.body;


  if (!sub_account_id || !credentials_id) {
    res.status(400).json({ message: 'ID de subcuenta y ID de credencial son requeridos.' });
    return;
  }

  try {
    // Verificar que la subcuenta existe
    const [subAccountResults] = await connection.promise().query(
      'SELECT id FROM sub_accounts WHERE id = ?', [sub_account_id]
    ) as any[];

    if (subAccountResults.length === 0) {
      res.status(404).json({ message: 'Subcuenta no encontrada.' });
      return;
    }

    // Verificar que la credencial existe
    const [credentialsResults] = await connection.promise().query(
      'SELECT id FROM credentials WHERE id = ?', [credentials_id]
    ) as any[];

    if (credentialsResults.length === 0) {
      res.status(404).json({ message: 'Credencial no encontrada.' });
      return;
    }

    // Asociar credencial a subcuenta
    await connection.promise().query(`
      INSERT INTO sub_account_credentials (sub_account_id, credentials_id, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `, [sub_account_id, credentials_id]);

    res.status(201).json({ message: 'Credencial asociada exitosamente a la subcuenta.' });
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al asociar la credencial a la subcuenta.' });
  }
};

//Ruta para eliminar una credencial
export const deleteCredential = async (req: Request, res: Response): Promise<void> => {
  const { credential_id, name } = req.query; // Se obtiene el ID o el nombre de la query

  if (!credential_id && !name) {
    res.status(400).json({ message: 'Debe proporcionar un ID o un nombre de credencial para eliminar.' });
    return;
  }

  try {
    let query = 'DELETE FROM credentials WHERE ';
    let params: any[] = [];

    if (credential_id) {
      query += 'id = ?';
      params.push(credential_id);
    } else {
      query += 'name = ?';
      params.push(name);
    }

    const [result] = await connection.promise().query(query, params) as [ResultSetHeader, any];

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'No se encontró la credencial a eliminar.' });
      return;
    }

    console.log(`Se eliminaron ${result.affectedRows} credenciales.`);
    res.status(200).json({
      message: `Se eliminaron ${result.affectedRows} credenciales.`,
      affectedRows: result.affectedRows
    });
  } catch (err) {
    console.error('Error al eliminar la credencial:', err);
    res.status(500).json({ message: 'Error al eliminar la credencial.' });
  }
};

// Actualizar credencial
export const updateCredential = async (req: Request, res: Response): Promise<void> => {
  const credentialId = req.params.id;
  const { name, json } = req.body;

  if (!credentialId) {
    res.status(400).json({ message: 'ID de credencial es requerido.' });
    return 
  }

  try {
    // Verificar que la credencial existe
    const [credentialResults] = await connection.promise().query<any[]>('SELECT id FROM credentials WHERE id = ?', [credentialId]);

    if (credentialResults.length === 0) {
      res.status(404).json({ message: 'Credencial no encontrada.' });
      return 
    }

    // Validar que el JSON sea válido
    try {
      // Verificar si ya es un string JSON o es un objeto
      let jsonString = json;
      if (typeof json === 'object') {
        jsonString = JSON.stringify(json);
      } else {
        // Verificar que es un JSON válido tratando de parsearlo
        JSON.parse(json);
      }
    } catch (e) {
      res.status(400).json({ message: 'El formato JSON no es válido.' });
      return 
    }

    // Actualizar los datos de la credencial
    const [result] = await connection.promise().query(`
      UPDATE credentials
      SET 
        name = ?,
        json = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [name, json, credentialId]);

    if ((result as any).affectedRows === 0) {
      res.status(500).json({ message: 'No se pudo actualizar la credencial.' });
      return 
    }

    res.status(200).json({
      message: 'Credencial actualizada exitosamente.',
      credentialId: credentialId
    });
  } catch (err) {
    console.error('Error al actualizar la credencial:', err);
    res.status(500).json({ message: 'Error al actualizar la credencial.' });
  }
};

// Ruta para obtener las credenciales asociadas al usuario
export const getUserCredentials = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params; // Si el email se envía como parámetro en la URL

  if (!email) {
    res.status(400).json({ message: 'Email es requerido.' });
    return;
  }

  try {
    // Primero obtenemos el ID del usuario mediante su email
    const [userResults] = await connection.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as [any[], any];

    if (userResults.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return;
    }

    const userId = userResults[0].id;

    // Luego obtenemos las credenciales asociadas a ese usuario
    const [results] = await connection.promise().query(`
      SELECT
        id,
        user_id AS Usuario,
        name AS Nombre,
        json,
        DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
        DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado
      FROM
        credentials
    `, [userId]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener las credenciales del usuario.' });
  }
};