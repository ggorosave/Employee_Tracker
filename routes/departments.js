const departments = require('express').Router();
const UserQuery = require('../lib/userQuery'); 

// uses class
departments.get('/', (req, res) => {
    const newQuery = new UserQuery();
    const sql = `SELECT department_name AS Department FROM department`;
    newQuery.readAll(sql, res);
});

module.exports = departments;