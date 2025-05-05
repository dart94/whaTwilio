import { Request, Response } from "express";
import { connection } from "../config/db.config";

//ruta para obtener campañas
export const getCampaigns = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [results, fields] = await connection.execute(`
      SELECT 
        c.id AS ID,
        c.name AS Nombre,
        c.description AS Descripción,
        c.sub_account_id AS Subcuenta,
        COUNT(DISTINCT t.id) AS CredencialTwilio,
        COUNT(DISTINCT s.id) AS CredencialGcp,
        COALESCE(COUNT(DISTINCT t.id), 0) AS Plantillas,
        COALESCE(COUNT(DISTINCT s.id), 0) AS Sheets,
        DATE_FORMAT(c.created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
        DATE_FORMAT(c.updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado,
        'Editar' AS Acciones
      FROM 
        Campaign c
      LEFT JOIN 
        Templates t ON c.id = t.campaign_id
      LEFT JOIN 
        Sheets s ON c.id = s.campaign_id
      GROUP BY 
        c.id, c.name, c.description, c.sub_account_id, c.created_at, c.updated_at
      ORDER BY 
        c.id DESC;
    `);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({ message: "Error al obtener las campañas." });
  }
};

//obtener campañas por ID de subcuenta
export const getCampaignsBySubAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { sub_account_id } = req.params;

  // Validar que el ID sea un número entero
  if (!sub_account_id || isNaN(Number(sub_account_id))) {
    res.status(400).json({ message: "ID de subcuenta inválido" });
    return;
  }

  try {
    const sql = `
      SELECT 
        id,
        name,
        description,
        created_at,
        updated_at,
        credential_sheet_id,
        credential_template_id,
        sub_account_id
      FROM 
        campaign
      WHERE 
        sub_account_id = ?;
    `;
    const [results] = await connection.query(sql, [sub_account_id]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({ message: "Error al obtener las campañas." });
  }
};

//ruta para crear campaña
export const createCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    description,
    sub_account_id,
    credential_sheet_id,
    credential_template_id,
  } = req.body;

  if (
    !name ||
    !sub_account_id ||
    !credential_sheet_id ||
    !credential_template_id
  ) {
    res
      .status(400)
      .json({ message: "Nombre, subcuenta y credenciales son requeridos." });
    return;
  }

  try {
    // Verificar que la subcuenta existe

    const [subAccountResults] = (await connection.query(
      "SELECT id FROM sub_accounts WHERE id = ?",
      [sub_account_id]
    )) as [any[], any];
    if (subAccountResults.length === 0) {
      res.status(404).json({ message: "Subcuenta no encontrada." });
      return;
    }

    // Verificar que las credenciales existen
    const [sheetCredentialResults] = (await connection.query(
      "SELECT id FROM credentials WHERE id = ?",
      [credential_sheet_id]
    )) as [any[], any];

    if (sheetCredentialResults.length === 0) {
      res
        .status(404)
        .json({ message: "Credencial para Google Sheets no encontrada." });
      return;
    }

    const [templateCredentialResults] = (await connection.query(
      "SELECT id FROM credentials WHERE id = ?",
      [credential_template_id]
    )) as [any[], any];

    if (templateCredentialResults.length === 0) {
      res
        .status(404)
        .json({ message: "Credencial para mensajes no encontrada." });
      return;
    }

    // Insertar la campaña en la base de datos
    const [result] = (await connection.query(
      "INSERT INTO campaign (name, description, sub_account_id, credential_sheet_id, credential_template_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [
        name,
        description,
        sub_account_id,
        credential_sheet_id,
        credential_template_id,
      ]
    )) as [any, any];

    // SOLO UNA RESPUESTA al final del try
    res.status(201).json({
      message: "Campaña creada correctamente.",
      campaignId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error en la consulta:", err);
    res.status(500).json({ message: "Error al crear la campaña.", error: err });
  }
};
