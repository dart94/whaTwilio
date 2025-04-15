// src/models/BaseModel.ts
import {connection} from '../config/db.config';

export abstract class BaseModel<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findAll(filter?: Partial<T>): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    if (filter && Object.keys(filter).length > 0) {
      const conditions = Object.keys(filter).map((key) => {
        params.push((filter as any)[key]);
        return `${key} = ?`;
      });
      query += ' WHERE ' + conditions.join(' AND ');
    }
    const [rows]: any = await connection.execute(query, params);
    return rows as T[];
  }

  async findById(id: number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [rows]: any = await connection.execute(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async remove(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const [result]: any = await connection.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Estos métodos varían según el modelo, por lo que se dejan abstractos
  abstract create(item: T): Promise<number>;
  abstract update(id: number, item: T): Promise<boolean>;
}
