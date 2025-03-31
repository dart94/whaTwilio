import { Request, Response, RequestHandler } from 'express';
import { connection } from '../config/db.config';
import { cliSheets } from '../config/google.config';

//Obtener los encabezados de una hoja de cálculo
export const getSheetHeadersById = async (req: Request, res: Response): Promise<void> => {
    try {
      const sheetId = req.params.id;
      if (!sheetId) {
        res.status(400).json({ success: false, error: 'ID de hoja no proporcionado' });
        return;
      }
      
      console.log('SheetId recibido:', sheetId);
      
      // Convertir el callback de connection.execute a una Promesa
      const rows = await new Promise<any[]>((resolve, reject) => {
        connection.execute(
          'SELECT sheet_id, sheet_sheet, sheet_range FROM sheets WHERE id = ?',
          [sheetId],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results as any[]);
            }
          }
        );
      });
      
      console.log('Rows encontrados:', rows);
      
      if (rows.length === 0) {
        res.status(404).json({ success: false, error: 'Hoja no encontrada' });
        return;
      }
      
      const { sheet_id, sheet_sheet, sheet_range } = rows[0];
      console.log('Detalles de la hoja:', { sheet_id, sheet_sheet, sheet_range });
      
      const range = `${sheet_sheet}!A1:ZZ1`;
      
      try {
        const headersResponse = await cliSheets.spreadsheets.values.get({
          spreadsheetId: sheet_id,
          range,
        });
        
        console.log('Respuesta de Google Sheets:', headersResponse.data);
        const headers = headersResponse.data.values ? headersResponse.data.values[0] : [];
        res.status(200).json({ success: true, headers });
      } catch (googleSheetsError: any) {
        console.error('Error específico de Google Sheets:', googleSheetsError);
        res.status(500).json({
          success: false,
          error: 'Error al obtener encabezados de Google Sheets',
          details: googleSheetsError.message
        });
      }
    } catch (error: unknown) {
      console.error('Error completo:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener encabezados',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

//Obtener las hojas asociadas a una campaña
export const getSheetsByCampaign = async (req: Request, res: Response): Promise<void> => {
    const { campaign_id } = req.params;

    if (!campaign_id) {
      res.status(400).json({ message: 'ID de campaña es requerido' });
      return 
    }
  
    try {
      const [results] = await connection.promise().query(`
        SELECT id, sheet_id, sheet_sheet, sheet_range, field_blacklist, field_status, field_contact
        FROM Sheets
        WHERE campaign_id = ?
      `, [campaign_id]);
  
      res.status(200).json(results);
    } catch (err) {
      console.error('Error al obtener las hojas:', err);
      res.status(500).json({ message: 'Error al obtener las hojas de la campaña' });
    }
  };
