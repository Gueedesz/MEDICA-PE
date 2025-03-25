const mysql = require('mysql2/promise'); // Certifique-se de usar 'promise' aqui
require('dotenv').config(); // Carrega variáveis do arquivo .env

// Configuração da conexão com o banco de dados
const mysqlConnection = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'medicape',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = mysqlConnection;
