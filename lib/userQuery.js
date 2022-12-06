const { json } = require('express');
const connection = require('../config/connection.js');

class UserQuery {
    constructor() {
        this.db = connection;
    }

    async readAll(sql, res) {
        const [result] = await this.db.promise().query(sql);
            
        return res.json({
            message: 'success',
            data: result
        });

    }

    async getQueryCode(sql, params, res, message) {
        const [result] = await this.db.promise().query(sql, params);

        return res.json(`${params} ${message}`);
    }

    addToDatabase(sql, params, res) {
        this.getQueryCode(sql, params, res, 'succesfully added to database!')
    }

    deleteFromDatabase(table, params, res) {
        const sql = `DELETE FROM ${table} WHERE id = ?`;

        this.getQueryCode(sql, params, res, 'succesfully deleted from database!')
    }

    updateDatabase(sql, params, res) {

        this.getQueryCode(sql, params, res, 'has been updated!')
    }

    mainMenu() {
        
    }
}

module.exports = UserQuery;