const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../config/connection.js');

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

    async getRoleList() {
        const [result] = await this.db.promise().query(`SELECT id, title FROM role`);

        // empty array for department names
        const roles = []

        // pushes dept names into the departments array
        result.forEach(obj => roles.push(obj.title));

        return roles;
    };

    async getRoleId (roleName) {
        
        const [result] = await this.db.promise().query(`SELECT id, title FROM role`);

        // filters the result for the department with the matching name and returns the id
        const roleId = result.filter(obj => obj.title === roleName)[0].id;

        return roleId;
    };

    async getManagerList() {
        const [result] = await this.db.promise().query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`);

        const managers = [];

        result.forEach(({first_name, last_name}) => {
            const fullName = [first_name, last_name].join(' ');

            managers.push(fullName);
        });

        return managers;
    }

    async getManagerId(manager) {
        
        // returns null if employee is a manager
        if (manager === 'Employee Is Manager') {

            const managerId = null;

            return managerId;
        } 

        // pulls list of managers first names and ids
        const [result] = await this.db.promise().query(`SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL`);
        
        // splits the name so function can compare first names and last names of managers
        const firstName = manager.split(' ')[0];
        const lastName = manager.split(' ')[1];
        
        const managerId = result.filter(obj => obj.first_name === firstName && obj.last_name === lastName)[0].id;
        
        return managerId;
    }

    async getEmployeeList() {
        const [result] = await this.db.promise().query(`SELECT first_name, last_name FROM employee`);

        const employees = [];

        result.forEach(({first_name, last_name}) => {
            const fullName = [first_name, last_name].join(' ');

            employees.push(fullName);
        });

        return employees;
    };

    async getEmployeeId(employee) {

        // pulls list of employees names and ids
        const [result] = await this.db.promise().query(`SELECT id, first_name, last_name FROM employee`);
        
        // splits the name so function can compare first names and last names
        const firstName = employee.split(' ')[0];
        const lastName = employee.split(' ')[1];
        
        const employeeId = result.filter(obj => obj.first_name === firstName && obj.last_name === lastName)[0].id;
        
        
        return employeeId;
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
    async addToDatabase(sql, ...params) {
        // waits for query to be sent to db
        await this.db.promise().query(sql, params);

        // lets user know their dept has been added to the db
        await console.log('\n');
        await console.log(`Added!`);
        await console.log('\n');

        // sends user back to main menu
        this.mainMenu();
    }

    // async function to delete dept from database
    async deleteFromDatabase(table, params) {
        const sql = `DELETE FROM ${table} WHERE id = ?`;

        // waits for query to be sent to db
        await this.db.promise().query(sql, params);

        await console.log('\n');
        await console.log(`Deleted!`);
        await console.log('\n');

        // sends user back to main menu
        this.mainMenu();
    }

    // update employee role
    async updateEmployeeRole(newRoleId, employeeId, employee) {
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        const params = [newRoleId, employeeId]

        await this.db.promise().query(sql, params);

        await console.log('\n');
        await console.log(`${employee}'s role has been updated!`);
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
                this.addToDatabase(`INSERT INTO department (department_name)
                VALUES (?)`, departmentName);
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
                this.deleteFromDatabase('department',departmentId);
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
                this.addToDatabase(`INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`, roleName, roleSalary, departmentId);
            })
    }

    async deleteRolePrompt() {

        const roles = await this.getRoleList();


        return inquirer
            .prompt([
                {

                    type: 'list',
                    name: 'deleteRole',
                    message: 'Choose a role to delete:',
                    choices: [...roles],

                },
            ]).then(async (ans) => {
                const { deleteRole } = ans;

                // filters the result for the department with the matching name and returns the id
                const roleId = await this.getRoleId(deleteRole);

                // deletes selected item from departments
                this.deleteFromDatabase('role', roleId);
            })
    };

    async addEmployeePrompt() {

        const roles = await this.getRoleList();
        const managers = await this.getManagerList();

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
                    choices: [...roles],
            
                },
                {
            
                    type: 'list',
                    name: 'manager',
                    message: 'Choose the employee\'s manager:',
                    choices: [...managers, 'Employee Is Manager'],
            
                },
            ]).then(async (ans) => {

                // destructures answer
                const { firstName, lastName, role, manager } = ans;

                const roleId = await this.getRoleId(role);

                const managerId = await this.getManagerId(manager);

                // calls the addToDatabase function and sets department name as params
                this.addToDatabase(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?,?,?,?)`, firstName, lastName, roleId, managerId);
            })
    };

    async updateEmployeeRolePrompt() {
        
        const employees = await this.getEmployeeList();
        const roles = await this.getRoleList();

        return inquirer
            .prompt([
                {

                    type: 'list',
                    name: 'employee',
                    message: 'Choose the employee you want to update:',
                    choices: [...employees],
            
                },
                {
            
                    type: 'list',
                    name: 'newRole',
                    message: 'Choose the employee\'s new role:',
                    choices: [...roles],
            
                },
            ]).then(async (ans) => {

                // destructures answer
                const { employee, newRole } = ans;

                const roleId = await this.getRoleId(newRole);

                const employeeId = await this.getEmployeeId(employee);

                // calls the addToDatabase function and sets department name as params
                this.updateEmployeeRole(roleId, employeeId, employee);
            })
    }
    
    async deleteEmployeePrompt() {

        const employees = await this.getEmployeeList();

        return inquirer
            .prompt([
                {

                    type: 'list',
                    name: 'deleteEmployee',
                    message: 'Choose an employee to delete:',
                    choices: [...employees],

                },
            ]).then(async (ans) => {
                const { deleteEmployee } = ans;

                // filters the result for the department with the matching name and returns the id
                const employeeId = await this.getEmployeeId(deleteEmployee);

                // deletes selected item from departments
                this.deleteFromDatabase('employee', employeeId);
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
                    choices: ['View All Departments', 'Add a Department', 'Delete a Department', 'View all Roles', 'Add Role', 'Delete a Role', 'View all Employees', 'Add Employee', 'Update Employee Role', 'Delete an Employee', 'Quit'],
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
                        this.readAll(`SELECT r.id AS ID, r.title AS Title, r.salary AS Salary, d.department_name AS Department FROM role r JOIN department d ON r.department_id = d.id`);
                        break;

                    case 'Add Role':

                        // calls the addRolePrompt method to get inputs from the user then pass inputs to the addToDatabase method
                        this.addRolePrompt();
                        break;
                    
                    case 'Delete a Role':
                        // calls the deleteRolePrompt method to get input from the user then pass inputs to the deleteFromDatabase method
                        this.deleteRolePrompt();
                        break;

                    case 'View all Employees':

                        // passes sql statment into readAll method to return a formated table for employees
                        this.readAll(`SELECT e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS Title, r.salary AS Salary, d.department_name AS Department, CONCAT(m.first_name, ' ', m.last_name) as Manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id`);
                        break;

                    case 'Add Employee':
                        // calls the addEmployeePrompt method to get inputs from the user then pass inputs to the addToDatabase method
                        this.addEmployeePrompt();
                        break;

                    case 'Update Employee Role':

                        // calls the addRolePrompt method to get inputs from the user then pass inputs to the updateDatabase method
                        this.updateEmployeeRolePrompt();
                        break;

                    case 'Delete an Employee':
                        // calls the deleteEmployeePrompt method to get input from the user then pass inputs to the deleteFromDatabase method
                        this.deleteEmployeePrompt();
                        break;

                    case 'Quit':
                        
                        // ASCII message that says "Bye!"
                        console.log(` ____                _ 
|  _ \\              | |
| |_) | _   _   ___ | |
|  _ < | | | | / _ \\| |
| |_) || |_| ||  __/|_|
|____/  \\__, | \\___|(_)
         __/ |         
        |___/          
        `   )
                        
                        // Exits the menu
                        process.exit();

                    default:
                        // default throws an error to let me know I probably typed something wrong
                        throw 'ERROR: Check for typos in code'
                }
            })
    }

    queryStart() {
      
        // logs ASCII message that says "Employee Tracker" 
        console.log(`
 _____                    _                             _____                   _                
| ____| _ __ ___   _ __  | |  ___   _   _   ___   ___  |_   _|_ __  __ _   ___ | | __ ___  _ __  
|  _|  | '_ \` _ \\ | '_ \\ | | / _ \\ | | | | / _ \\ / _ \\   | | | '__|/ _\` | / __|| |/ // _ \\| '__| 
| |___ | | | | | || |_) || || (_) || |_| ||  __/|  __/   | | | |  | (_| || (__ |   <|  __/| |    
|_____||_| |_| |_|| .__/ |_| \\___/  \\__, | \\___| \\___|   |_| |_|   \\__,_| \\___||_|\\_\\\\___||_|    
                  |_|               |___/                                                        
                         `);

        this.mainMenu();
    }
}

module.exports = UserQuery;