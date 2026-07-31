const mysql = require("mysql2");

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "4564",
    database: "rackdevops"
});

module.exports = connection.promise();