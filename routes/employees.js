const employees = require('express').Router();
const UserQuery = require('../lib/userQuery'); 

// uses class
employees.get('/', (req, res) => {
    const newQuery = new UserQuery();
    const sql = `SELECT e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS Title, r.salary AS Salary, d.department_name AS Department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id`;
    newQuery.readAll(sql, res);
});

// create an employee
departments.post('/new-employee', ({ body }, res) => {
    const newQuery = new UserQuery();
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

    newQuery.addToDatabase(sql, params, res);
});

module.exports = employees;