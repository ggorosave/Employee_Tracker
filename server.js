// imports
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
// imports routes
const api = require('./routes/index.js')

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', api);

// Code for later use

// delete a role
roles.delete('/:id', (req, res) => {
    const newQuery = new UserQuery();
    const params = [req.params.id];

    newQuery.deleteFromDatabase('role', params, res);
});


// delete an employee
employees.delete('/:id', (req, res) => {
    const newQuery = new UserQuery();
    const params = [req.params.id];

    newQuery.deleteFromDatabase('employee', params, res);
});

// Runs server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
