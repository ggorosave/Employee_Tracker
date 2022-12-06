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


// Runs server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
