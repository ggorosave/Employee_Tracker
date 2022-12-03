const employees = require('express').Router();
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

employees.get('/', (req, res) => {
    const sql = `SELECT e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS Title, r.salary AS Salary, d.department_name AS Department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id`;

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

module.exports = employees;