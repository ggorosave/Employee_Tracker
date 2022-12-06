const roles = require('express').Router();
const UserQuery = require('../lib/userQuery'); 

// read roles
roles.get('/', (req, res) => {
    const newQuery = new UserQuery();
    const sql = `SELECT title, salary FROM role`;
    newQuery.readAll(sql, res);
});

// create a role
roles.post('/new-role', ({ body }, res) => {
    const newQuery = new UserQuery();
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
    const params = [body.title, body.salary, body.department_id];

    newQuery.addToDatabase(sql, params, res);
});

// update a role

// delete a role
roles.delete('/:id', (req, res) => {
    const newQuery = new UserQuery();
    const params = [req.params.id];

    newQuery.deleteFromDatabase('role', params, res);
});

module.exports = roles;