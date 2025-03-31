import { connection } from '../config/db.config';
import { RowDataPacket } from 'mysql2/promise';

export interface Sheet {
    id?: number;
    sheet_id: string;
    sheet_sheet: string;
    sheet_range: string;
    field_blacklist: string;
    field_status: string;
    field_contact: string;
    created_at?: Date;
    updated_at?: Date;
    campaign_id: number;
  
}


// Método para crear una nueva hoja
export const create = async (sheet: Sheet): Promise<number> => {
    try {
      const query = `
        INSERT INTO Sheets 
        (sheet_id, sheet_sheet, sheet_range, field_blacklist, field_status, field_contact, created_at, updated_at, campaign_id)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
      `;
      const params: any[] = [
        sheet.sheet_id,
        sheet.sheet_sheet,
        sheet.sheet_range,
        sheet.field_blacklist,
        sheet.field_status,
        sheet.field_contact,
        sheet.campaign_id
      ];
      const [result]: any = await connection.execute(query, params);
      return result.insertId;
    } catch (error) {
      console.error('Error al crear Sheet:', error);
      throw error;
    }
  };

// Método para obtener todas las Sheets.
export const findAll = async (filter?: Partial<Sheet>): Promise<Sheet[]> => {
  try {
    let query = 'SELECT * FROM Sheets';
    const params: any[] = [];
    
    if (filter && Object.keys(filter).length > 0) {
      const conditions = Object.keys(filter).map((key) => {
        params.push((filter as any)[key]);
        return `${key} = ?`;
      });
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Uso de RowDataPacket para tipar correctamente
    const [rows] = await connection.promise().execute<RowDataPacket[]>(query, params);
    
    return rows as Sheet[];
  } catch (error) {
    console.error('Error al obtener Sheets:', error);
    throw error;
  }
};

export default {
    create,
    findAll
}


