const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'muppetsinc_db'
    },
    console.log('Connected to the muppetsinc_db database')
);

module.exports = connection;