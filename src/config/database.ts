import mysql from 'mysql';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'proyecto_calidad',
  charset: 'utf8mb4'
};

// Crear pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  ...dbConfig,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000
});

// Función para ejecutar consultas
export const query = (sql: string, params?: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Función para obtener una conexión del pool
export const getConnection = (): Promise<mysql.Connection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
};

export default pool; 