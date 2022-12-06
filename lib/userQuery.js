const { json } = require('express');
const mysql = require('mysql2');


class UserQuery {
    constructor() {
        // this.mysql = require('mysql2/promise');
        this.connection = mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'tacocat',
                database: 'muppetsinc_db'
            },
            console.log('Connected to the muppetsinc_db database')
        );
    }

    async readAll(sql, res) {
        const db = await this.connection;

        const [result] = await db.promise().query(sql);
            
        return res.json({
            message: 'success',
            data: result
        });

    }

    async getQueryCode(sql, params, res, message) {
        const db = await this.connection;

        const [result] = await db.promise().query(sql, params);

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
    
}

module.exports = UserQuery;