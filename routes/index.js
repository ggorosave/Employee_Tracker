const express = require('express');
// import routers
const departmentRouter = require('./departments');
const roleRouter = require('./roles');
const employeeRouter = require('./employees');

const app = express();

app.use('/departments', departmentRouter);
app.use('/roles', roleRouter);
app.use('/employees', employeeRouter);

module.exports = app;
