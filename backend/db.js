const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,   // <-- IMPORTANTE: debe ser DB_USERNAME
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});
