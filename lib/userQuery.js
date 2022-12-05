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

    async addToDatabase(sql, params, res) {
        const db = await this.connection;

        db.promise().query(sql, params)
            .then((result) => {
                res.json(`${params} succesfully added to database!`);
            }).catch((error) => {
                console.log(error);
            }).then( () => db.end());
    }
}

module.exports = UserQuery;