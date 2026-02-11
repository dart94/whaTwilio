import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config(); 

export const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: Number(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'railway2',
});

console.log("MYSQLHOST", process.env.MYSQLHOST);
console.log("DB_HOST", process.env.DB_HOST);