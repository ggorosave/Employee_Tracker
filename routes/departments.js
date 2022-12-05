const departments = require('express').Router();
const UserQuery = require('../lib/userQuery');



// read all departments
departments.get('/', (req, res) => {
    const newQuery = new UserQuery();
    const sql = `SELECT department_name AS Department FROM department`;
    newQuery.readAll(sql, res);
});

// create a department
departments.post('/new-department', ({ body }, res) => {
    const newQuery = new UserQuery();
    const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
    const params = [body.department_name];

    newQuery.addToDatabase(sql, params, res);
});

module.exports = departments;