import { Request, Response, RequestHandler } from "express";
import { connection } from "../config/db.config";
import {
  getContentTemplates,
  getTemplateDetails,
} from "../controllers/twilio.controller";
import twilioCredentialsModel from "../models/TwilioCredentials";

// Obtener plantillas asociadas a una campaña
export const getTemplatesByCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { campaign_id } = req.params;

  if (!campaign_id || isNaN(Number(campaign_id))) {
    res.status(400).json({ message: "ID de campaña inválido" });
    return;
  }

  try {
    const sql = `
        SELECT 
          t.id AS ID,
          t.name AS Nombre,
          t.associated_fields AS Campos,
          t.sid AS sid,           
          t.campaign_id AS Campana,
          DATE_FORMAT(t.created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
          DATE_FORMAT(t.updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado
        FROM 
          Templates t
        WHERE 
          t.campaign_id = ${connection.escape(campaign_id)} 
        ORDER BY 
          t.id DESC;
      `;

    const [results] = await connection.query(sql);
    res.status(200).json(results); // Devolver los resultados
  } catch (err) {
    console.error("Error al obtener las plantillas:", err);
    res.status(500).json({ message: "Error al obtener las plantillas." });
  }
};

// Obtener los campos de una plantilla específica
export const getTemplateFields = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { template_id } = req.params;

  if (!template_id) {
    res.status(400).json({ message: "ID de plantilla es requerido" });
    return;
  }

  try {
    const [results] = await connection.query<any[]>(
      `
      SELECT id, name, associated_fields, sid
      FROM Templates
      WHERE id = ?
    `,
      [template_id]
    );

    if (results.length === 0) {
      res.status(404).json({ message: "Plantilla no encontrada" });
      return;
    }

    // Parsear associated_fields que es un objeto JSON almacenado como string
    const template = results[0];
    let associatedFields = {};

    try {
      if (template.associated_fields) {
        associatedFields = JSON.parse(template.associated_fields);
      }
    } catch (parseError) {
      console.error("Error al parsear associated_fields:", parseError);
    }

    res.status(200).json({
      id: template.id,
      name: template.name,
      sid: template.sid,
      associated_fields: associatedFields,
    });
  } catch (err) {
    console.error("Error al obtener los campos de la plantilla:", err);
    res
      .status(500)
      .json({ message: "Error al obtener los campos de la plantilla" });
  }
};

//Asociar campos entre plantillas y hojas
export const associateFieldsToTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    campaign_id,
    sheet_id,
    field_mappings,
    template_id,
    field_blacklist,
    field_status,
    field_contact,
  } = req.body;

  if (!campaign_id || !sheet_id || !template_id) {
    res.status(400).json({
      message: "ID de campaña, ID de hoja y ID de plantilla son requeridos",
    });
    return;
  }

  try {
    // 1. Actualizar la tabla Sheets con la información de los campos
    await connection.query(
      `
      UPDATE Sheets
      SET field_blacklist = JSON_ARRAY(?),
          field_status = ?,
          field_contact = ?,
          updated_at = NOW()
      WHERE id = ? AND campaign_id = ?
    `,
      [field_blacklist, field_status, field_contact, sheet_id, campaign_id]
    );

    // 2. Actualizar la tabla Templates con el mapeo de campos
    // Convertir el objeto field_mappings a JSON string
    const associated_fields_json = JSON.stringify(field_mappings);

    await connection.query(
      `
      UPDATE Templates
      SET associated_fields = ?,
          updated_at = NOW()
      WHERE id = ? AND campaign_id = ?
    `,
      [associated_fields_json, template_id, campaign_id]
    );

    res.status(200).json({
      message: "Campos asociados exitosamente",
      updated: {
        sheet: { id: sheet_id, field_blacklist, field_status, field_contact },
        template: { id: template_id, associated_fields: field_mappings },
      },
    });
  } catch (err) {
    console.error("Error al asociar los campos:", err);
    res.status(500).json({ message: "Error al asociar los campos" });
  }
};

// endpoint para obtener los campos de una plantilla específica
export const getTemplateFieldsByCampaignId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { campaign_id } = req.params;

  if (!campaign_id) {
    res.status(400).json({ message: "ID de campaña es requerido" });
    return;
  }

  try {
    const [results]: any = await connection.query(
      `
      SELECT id, name, associated_fields, sid
      FROM Templates
      WHERE campaign_id = ?
    `,
      [campaign_id]
    );

    if (results.length === 0) {
      res
        .status(404)
        .json({ message: "No se encontraron plantillas para esta campaña" });
      return;
    }

    const template = results[0];

    let associated_fields = {};

    if (typeof template.associated_fields === "string") {
      try {
        associated_fields = JSON.parse(template.associated_fields);
      } catch (error) {
        console.error("Error al parsear associated_fields:", error);
        associated_fields = {};
      }
    } else if (typeof template.associated_fields === "object") {
      associated_fields = template.associated_fields;
    }

    res.status(200).json({
      associated_fields,
      sid: template.sid,
      name: template.name,
    });
  } catch (err) {
    console.error("Error al obtener las plantillas:", err);
    res
      .status(500)
      .json({ message: "Error al obtener las plantillas de la campaña" });
  }
};

// Obtener plantillas asociadas a una campaña Twilio
export const getTemplates: RequestHandler = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      res.status(400).json({ message: 'El parámetro "name" es requerido.' });
      return;
    }

    const credentials = await twilioCredentialsModel.findByName(name as string);

    if (!credentials) {
      res.status(404).json({
        message: `No se encontró una credencial con el nombre "${name}".`,
      });
      return;
    }

    // Extraer y parsear la columna "json"
    const { json } = credentials;
    const parsedCredentials =
      typeof json === "string" ? JSON.parse(json) : json;

    const { account_sid, auth_token } = parsedCredentials;

    const twilioUrl = "https://content.twilio.com/v1/Content";

    // Obtener plantillas desde Twilio usando las credenciales dinámicas
    const templates = await getContentTemplates(account_sid, auth_token);

    const filteredTemplates = templates.map((template: any) => ({
      sid: template.sid,
      friendly_name: template.friendly_name,
      body: template.types?.["twilio/quick-reply"]?.body || "",
      variables: template.variables || {},
    }));

    res.json(filteredTemplates);
  } catch (error) {
    console.error("❌ Error obteniendo plantillas:", error);
    res.status(500).json({ error: "Error al obtener plantillas" });
  }
};

// Obtener detalles de una plantilla
export const getTemplateById: RequestHandler = async (req, res) => {
  try {
    const { name } = req.query;
    const { id } = req.params;

    if (!name) {
      res.status(400).json({ message: 'El parámetro "name" es requerido.' });
      return;
    }

    const credentials = await twilioCredentialsModel.findByName(name as string);

    if (!credentials) {
      res.status(404).json({
        message: `No se encontró una credencial con el nombre "${name}".`,
      });
      return;
    }

    // Extraer y parsear la columna "json"
    const { json } = credentials;
    const parsedCredentials = JSON.parse(json);

    const { account_sid, auth_token } = parsedCredentials;

    // Obtener detalles de la plantilla
    const template = await getTemplateDetails(account_sid, auth_token, id);

    res.json(template);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener detalles de la plantilla" });
  }
};

// Obtener plantillas desde Twilio Content
export async function findTemplateBySid(
  accountSid: string,
  authToken: string,
  sid: string
) {
  const templates = await getContentTemplates(accountSid, authToken);

  const selected = templates.find((t) => t.sid === sid);

  return selected;
}

export const postTemplates: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { name, associated_fields, sid, campaign_id } = req.body;

  if (!name || !sid || !campaign_id || !associated_fields) {
    console.error("❌ Datos inválidos:", {
      name,
      sid,
      campaign_id,
      associated_fields,
    });
    res.status(400).json({
      message: "Faltan campos requeridos o están vacíos.",
      name,
      sid,
      campaign_id,
      associated_fields,
    });

    return;
  }

  try {
    // 1) Insertamos a la base de datos
    const [result]: any = await connection.execute(
      `
      INSERT INTO Templates
        (name, associated_fields, sid, campaign_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
      `,
      [name, JSON.stringify(associated_fields), sid, Number(campaign_id)]
    );

    if (result.affectedRows === 1) {
      const [rows]: any = await connection.execute(
        `SELECT * FROM Templates WHERE id = ?`,
        [result.insertId]
      );

      res.status(201).json({ data: rows[0] });
    } else {
      res.status(500).json({ message: "No se insertó la plantilla." });
    }
  } catch (err) {
    console.error("Error al crear la plantilla:", err);
    res.status(500).json({ message: "Error interno al crear la plantilla." });
  }
};
