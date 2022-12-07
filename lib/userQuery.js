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

    // ==========GET LISTS & IDS METHODS=================

    // function to create an array of current departments to spread in questions later
    async getDepartmentList() {
        const [result] = await this.db.promise().query(`SELECT id, department_name FROM department`);

        // empty array for department names
        const departments = []

        // pushes dept names into the departments array
        result.forEach(obj => departments.push(obj.department_name));

        return departments;
    };

    // function to retrienve the id of a specifc id when give a dept name
    async getDepartmentId(departmentName) {
        const [result] = await this.db.promise().query(`SELECT id, department_name FROM department`);

        // filters the result for the department with the matching name and returns the id
        const departmentId = result.filter(obj => obj.department_name === departmentName)[0].id;

        return departmentId;
    }

    // ===========READ ALL, ADD TO, DELETE FROM==========

    // async function that take a prepared sql statement and sends user a formated table
    async readAll(sql) {

        // waits for table
        const [result] = await this.db.promise().query(sql)

        await console.log('\n');
        await console.table(result);

        this.mainMenu();
    }

    // async function to add department to database. takes the name of the table, the column names, a list of question marks corresponding to the number of questions, and the params. everything but the params will be written as a string.
    async addToDatabase(tableName, columnNames, questionMarks, ...params) {
        // prepares sql statment to insert a new department in department db
        const sql = `INSERT INTO ${tableName} (${columnNames})
        VALUES (${questionMarks})`;

        // waits for query to be sent to db
        const [result] = await this.db.promise().query(sql, params);

        // lets user know their dept has been added to the db
        await console.log('\n');
        await console.log(`${params} added to ${tableName} database!`);
        await console.log('\n');

        // sends user back to main menu
        this.mainMenu();
    }

    // async function to delete dept from database
    async deleteFromDatabase(table, itemName, params) {
        const sql = `DELETE FROM ${table} WHERE id = ?`;

        // waits for query to be sent to db
        const [result] = await this.db.promise().query(sql, params);

        await console.log('\n');
        await console.log(`${itemName} deleted from the ${table} database!`);
        await console.log('\n');

        // sends user back to main menu
        this.mainMenu();
    }

    
    // =============QUESTION PROMPTS====================

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
                this.addToDatabase('department', 'department_name', '?', departmentName);
            })
    };

    
    // For department only -->Delete after change above
    async deleteDepartmentPrompt() {

        const departments = await this.getDepartmentList();


        return inquirer
            .prompt([
                {

                    type: 'list',
                    name: 'deleteDept',
                    message: 'Choose a department to delete:',
                    // write code to return the current department list and add it here
                    choices: [...departments],

                },
            ]).then(async (ans) => {
                const { deleteDept } = ans;

                // filters the result for the department with the matching name and returns the id
                const departmentId = await this.getDepartmentId(deleteDept);

                // deletes selected item from departments
                this.deleteFromDatabase('department', deleteDept, departmentId);
            })
    };

    async addRolePrompt() {

        const departments = await this.getDepartmentList();

        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'Enter role name:',
                    validate: val => /[a-z]/gi.test(val),
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter the salary of the role:',
                    validate: val => /[0-9]/gi.test(val),
                },
                {

                    type: 'list',
                    name: 'department',
                    message: 'Which department does the role belong to:',
                    choices: [...departments],

                },
            ]).then(async (ans) => {

                // destructures answer
                const { roleName, roleSalary, department } = ans;

                const departmentId = await this.getDepartmentId(department);

                // calls the addToDatabase function and sets department name as params
                this.addToDatabase('role', 'title, salary, department_id', '?, ?, ?', roleName, roleSalary, departmentId);
            })
    }

    async addEmployeePrompt() {
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter employee\'s first name:',
                    validate: val => /[a-z]/gi.test(val),
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter employee\'s last name:',
                    validate: val => /[a-z]/gi.test(val),
                },
                {
            
                    type: 'list',
                    name: 'role',
                    message: 'Choose the employee\'s role:',
                    // write code to return the current department list of roles and add it here
                    choices: [],
            
                },
                {
            
                    type: 'list',
                    name: 'manager',
                    message: 'Choose the employee\'s manager:',
                    // write code to return the current department list of managers and add it here
                    choices: [],
            
                },
            ]).then(async (ans) => {

                // destructures answer
                const { roleName, roleSalary, department } = ans;

                const departmentId = await this.getDepartmentId(department);

                // calls the addToDatabase function and sets department name as params
                this.addToDatabase('role', 'title, salary, department_id', '?, ?, ?', roleName, roleSalary, departmentId);
            })
    };

    // =================MAIN MENU==========================
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
                // destructures ans
                const { userOption } = ans;

                // switch case for the users choice
                switch (userOption) {

                    case 'View All Departments':

                        // passes sql statment into readAll method to return a formated table for departments            
                        this.readAll(`SELECT id AS ID, department_name AS Department FROM department`);
                        break;

                    case 'Add a Department':

                        // calls the addDepartmentPrompt method to get input from the user then pass inputs to the addToDatabase method
                        this.addDepartmentPrompt();
                        break;

                    case 'Delete a Department':

                        // calls the deleteDepartmentPrompt method to get input from the user then pass inputs to the deleteFromDatabase method
                        this.deleteDepartmentPrompt();
                        break;

                    case 'View all Roles':

                        // passes sql statment into readAll method to return a formated table for roles
                        this.readAll(`SELECT id AS ID, title AS Title, salary AS Salary FROM role`);
                        break;

                    case 'Add Role':

                        // calls the addRolePrompt method to get inputs from the user then pass inputs to the addToDatabase method
                        this.addRolePrompt();
                        break;

                    case 'View all Employees':
                        // passes sql statment into readAll method to return a formated table for employees
                        this.readAll(`SELECT e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS Title, r.salary AS Salary, d.department_name AS Department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id`);
                        break;

                    case 'Add Employee':
                        // Add callback here
                        break;

                    case 'Update Employee Role':
                        // add callback here
                        break;

                    case 'Quit':
                        console.log('\n^^^^');
                        console.log('Bye!')
                        console.log('^^^^\n');
                        process.exit();

                    default:
                        // default throws an error to let me know I probably typed something wrong
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