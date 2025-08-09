const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'coding_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fonction pour tester la connexion au démarrage
async function checkDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Could not connect to the database:', error.message);
    // En mode développement, il est préférable d'arrêter le serveur si la DB n'est pas accessible.
    if (process.env.NODE_ENV === 'development') {
        process.exit(1);
    }
    throw error; // Propager l'erreur en production pour que le système de gestion de process puisse le redémarrer
  }
}

module.exports = { pool, checkDbConnection };
