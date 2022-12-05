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

        db.promise().query(sql)
            .then((result) => {
                res.json({
                    message: 'success',
                    data: result[0]
                });
            }).catch((error) => {
                console.log(error);
            }).then( () => db.end());
    }

    async getQueryCode(sql, params, res, message) {
        const db = await this.connection;

        db.promise().query(sql, params)
            .then((result) => {
                res.json(`${params} ${message}`);
            }).catch((error) => {
                console.log(error);
            }).then( () => db.end());
    }

    addToDatabase(sql, params, res) {
        
        this.getQueryCode(sql, params, res, 'succesfully added to database!')
    }

    deleteFromDatabase(table, params, res) {
        const sql = `DELETE FROM ${table} WHERE id = ?`;

        this.getQueryCode(sql, params, res, 'succesfully deleted from database!')
    }
    
}

module.exports = UserQuery;