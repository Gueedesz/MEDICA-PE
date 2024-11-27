const mysql = require('mysql2/promise'); // Certifique-se de usar 'promise' aqui
require('dotenv').config(); // Carrega variáveis do arquivo .env

// Configuração da conexão com o banco de dados
const mysqlConnection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'sua-senha',
    database: process.env.DB_NAME || 'medicape',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = mysqlConnection;
