import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'railway2',
});

export function connectDB(): void {
  connection.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      process.exit(1);
    } else {
      console.log('Conexión a la base de datos establecida.');
    }
  });
}

export { connection };