const mysql = require("mysql2");

// Leer variables de entorno con valores por defecto para desarrollo local
const connection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "4564",
    database: process.env.DB_NAME || "rackdevops",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection.promise();
