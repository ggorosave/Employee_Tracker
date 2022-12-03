// imports
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connects to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'tacocat',
        database: 'muppetsinc_db'
    },
    console.log('Connected to the muppetsinc_db database')
);

// Read departments
app.get('/api/departments', (req, res) => {
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

// Read roles
app.get('/api/roles', (req, res) => {
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

// Read all employees
app.get('/api/employees', (req, res) => {
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

// Runs server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
