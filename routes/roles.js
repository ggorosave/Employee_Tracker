const roles = require('express').Router();
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'tacocat',
        database: 'muppetsinc_db'
    },
    console.log('Connected to the muppetsinc_db database')
);

roles.get('/', (req, res) => {
    const sql = `SELECT title, salary FROM role`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

module.exports = roles;