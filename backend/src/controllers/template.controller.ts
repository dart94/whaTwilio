import { Request, Response } from 'express';
import { connection } from '../config/db.config';

// Obtener plantillas asociadas a una campaña
export const getTemplatesByCampaign = async (req: Request, res: Response): Promise<void> => {
    const { campaign_id } = req.params;

    if (!campaign_id || isNaN(Number(campaign_id))) {
        res.status(400).json({ message: 'ID de campaña inválido' });
      return 
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
  
      const [results] = await connection.promise().query(sql);
      res.status(200).json(results);  // Devolver los resultados
    } catch (err) {
      console.error('Error al obtener las plantillas:', err);
      res.status(500).json({ message: 'Error al obtener las plantillas.' });
    }
  };


// Obtener los campos de una plantilla específica
export const getTemplateFields = async (req: Request, res: Response): Promise<void> => {
  const { template_id } = req.params;

  if (!template_id) {
    res.status(400).json({ message: 'ID de plantilla es requerido' });
    return 
    
  }

  try {
    const [results] = await connection.promise().query<any[]>(`
      SELECT id, name, associated_fields, sid
      FROM Templates
      WHERE id = ?
    `, [template_id]);

    if (results.length === 0) {
      res.status(404).json({ message: 'Plantilla no encontrada' });
      return 
    }

    // Parsear associated_fields que es un objeto JSON almacenado como string
    const template = results[0];
    let associatedFields = {};

    try {
      if (template.associated_fields) {
        associatedFields = JSON.parse(template.associated_fields);
      }
    } catch (parseError) {
      console.error('Error al parsear associated_fields:', parseError);
    }

    res.status(200).json({
      id: template.id,
      name: template.name,
      sid: template.sid,
      associated_fields: associatedFields
    });
  } catch (err) {
    console.error('Error al obtener los campos de la plantilla:', err);
    res.status(500).json({ message: 'Error al obtener los campos de la plantilla' });
  }
};

//Asociar campos entre plantillas y hojas
export const associateFieldsToTemplate = async (req: Request, res: Response): Promise<void> => {
  const {
    campaign_id,
    sheet_id,
    field_mappings,
    template_id,
    field_blacklist,
    field_status,
    field_contact
  } = req.body;

  if (!campaign_id || !sheet_id || !template_id) {
    res.status(400).json({ message: 'ID de campaña, ID de hoja y ID de plantilla son requeridos' });
    return;
  }

  try {
    // 1. Actualizar la tabla Sheets con la información de los campos
    await connection.promise().query(`
      UPDATE Sheets
      SET field_blacklist = JSON_ARRAY(?),
          field_status = ?,
          field_contact = ?,
          updated_at = NOW()
      WHERE id = ? AND campaign_id = ?
    `, [field_blacklist, field_status, field_contact, sheet_id, campaign_id]);

    // 2. Actualizar la tabla Templates con el mapeo de campos
    // Convertir el objeto field_mappings a JSON string
    const associated_fields_json = JSON.stringify(field_mappings);

    await connection.promise().query(`
      UPDATE Templates
      SET associated_fields = ?,
          updated_at = NOW()
      WHERE id = ? AND campaign_id = ?
    `, [associated_fields_json, template_id, campaign_id]);

    res.status(200).json({
      message: 'Campos asociados exitosamente',
      updated: {
        sheet: { id: sheet_id, field_blacklist, field_status, field_contact },
        template: { id: template_id, associated_fields: field_mappings }
      }
    });
  } catch (err) {
    console.error('Error al asociar los campos:', err);
    res.status(500).json({ message: 'Error al asociar los campos' });
  }
};

// endpoint para obtener los campos de una plantilla específica
export const getTemplateFieldsByCampaignId = async (req: Request, res: Response): Promise<void> => {
  const { campaign_id } = req.params;

  if (!campaign_id) {
    res.status(400).json({ message: 'ID de campaña es requerido' });
    return 
  }

  try {
    const [results] = await connection.promise().query(`
      SELECT id, name, associated_fields, sid
      FROM Templates
      WHERE campaign_id = ?
    `, [campaign_id]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener las plantillas:', err);
    res.status(500).json({ message: 'Error al obtener las plantillas de la campaña' });
  }
};

