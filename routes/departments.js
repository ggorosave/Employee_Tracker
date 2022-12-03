const departments = require('express').Router();
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

// Read all departments
departments.get('/', (req, res) => {
    const sql = `SELECT department_name AS Department FROM department`;

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

module.exports = departments;