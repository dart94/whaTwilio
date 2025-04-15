import { BaseModel } from './BaseModel';
import { connection } from '../config/db.config';

export interface TwilioCredential {
  id?: number;
  name: string;
  json: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

class TwilioCredentialsModel extends BaseModel<TwilioCredential> {
  constructor() {
    super('credentials');
  }

  async findAll(): Promise<TwilioCredential[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const [rows]: any = await connection.execute(query);
    return rows;
  }

  async findByUserId(userId: number): Promise<TwilioCredential[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = ?`;
    const [rows]: any = await connection.execute(query, [userId]);
    return rows;
  }

  async findById(id: number): Promise<TwilioCredential | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const [rows]: any = await connection.execute(query, [name]);
    return rows.length > 0 ? rows[0] : null;
  }

  async findByName(name: string): Promise<TwilioCredential | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE name = ? LIMIT 1`;
    const [rows]: any = await connection.execute(query, [name]);
    return rows.length > 0 ? rows[0] : null;
  }

  async create(credencial: TwilioCredential): Promise<number> {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `INSERT INTO ${this.tableName} (name, json, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    const params = [credencial.name, credencial.json, now, now];
    const [result]: any = await connection.execute(query, params);
    return result.insertId;
  }

  async update(id: number, credencial: TwilioCredential): Promise<boolean> {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `UPDATE ${this.tableName} SET name = ?, json = ?, updated_at = ? WHERE id = ?`;
    const params = [credencial.name, credencial.json, now, id];
    const [result]: any = await connection.execute(query, params);
    return result.affectedRows > 0;
  }

  parseJsonField(jsonField: string): Record<string, any> | null {
    try {
      return JSON.parse(jsonField);
    } catch (err) {
      console.error('❌ Error parseando el campo JSON:', err);
      return null;
    }
  }
}

const twilioCredentialsModel = new TwilioCredentialsModel();
export default twilioCredentialsModel;
