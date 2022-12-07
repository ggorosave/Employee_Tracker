const { json } = require('express');
const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
const connection = require('../config/connection.js');

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

class UserQuery {
    constructor() {
        this.db = connection;
    }

    // async function that take a prepared sql statement and sends user a formated table
    async readAll(sql) {

        // waits for table
        const [result] = await this.db.promise().query(sql)
        
        await console.log('\n');
        await console.table(result);

        this.mainMenu();
        }

    async getQueryCode(sql, params, res, message) {
        const [result] = await this.db.promise().query(sql, params);

        return res.json(`${params} ${message}`);
    }

    // async function to add department to database
    async addToDatabase(params) {
        // prepares sql statment to insert a new department in department db
        const sql = `INSERT INTO department (department_name)
        VALUES (?)`;
        
        // waits for query to be sent to db
        const [result] = await this.db.promise().query(sql, params);

        // lets user know their dept has been added to the db
        await console.log('\n');
        await console.log(`${params} added to departments!`);
        
        // sends user back to main menu
        this.mainMenu();
    }

    // async function to delete dept from database
    async deleteFromDatabase(table, params) {
        const sql = `DELETE FROM ${table} WHERE id = ?`;

        // waits for query to be sent to db
        const [result] = await this.db.promise().query(sql, params);

        await console.log('\n');
        await console.log(`${params} deleted from ${table}!`);
    }

    updateDatabase(sql, params, res) {

        this.getQueryCode(sql, params, res, 'has been updated!')
    }

    addDepartmentPrompt() {
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'Enter department name:',
                    validate: val => /[a-z]/gi.test(val),
                },
            ]).then((ans) => {

                // destructures answer
                const { departmentName } = ans;

                // calls the addToDatabase function and sets department name as params
                this.addToDatabase(departmentName);
            })
    };

    async deleteDepartmentPropmt() {
        
        // reads database and returns departments
        const [result] = await this.db.promise().query(`SELECT department_name FROM department`);

        // empty array for department names
        const departments = [] 
        
        // pushes dept names into the departments array
        result.forEach(obj => departments.push(obj.department_name.trim()));

        
        return inquirer
            .prompt([
                {

                    type: 'list',
                    name: 'deleteDept',
                    message: 'Choose a department to delete:',
                    // write code to return the current department list and add it here
                    choices: [...departments],
            
                },
            ]).then((ans) => {
                console.log(ans);
            })
    };

    mainMenu() {
        return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'userOption',
                    message: 'Please select one of the options below:',
                    choices: ['View All Departments', 'Add a Department', 'Delete a Department', 'View all Roles', 'Add Role', 'View all Employees', 'Update Employee Role', 'Add Employee', 'Quit'],
                },
            ]).then((ans) => {
                console.log(ans);
                const { userOption } = ans;

                switch(userOption) {
                    case 'View All Departments':
                        // console.log('User will see a table of departments')
                        const sql = `SELECT id AS ID, department_name AS Department FROM department`;
                        this.readAll(sql);
                        break;
                    case 'Add a Department':
                        this.addDepartmentPrompt();
                        break;
                    case 'Delete a Department':
                        this.deleteDepartmentPropmt();
                        break;
                    case 'Quit':
                        console.log('Bye!')
                        process.exit();

                    default:
                        throw 'ERROR: Check for typos in code'
                }
            })
    }

    queryStart() {
        console.log(
            `==============START==============
      ANSWER THE QUESTIONS!
=================================`
        )

        this.mainMenu();
    }
}

module.exports = UserQuery;