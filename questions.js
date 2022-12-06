const inquirer = require('inquirer');

const menuPrompt = [
    {
        type: 'list',
        name: 'menuPrompt',
        message: 'Please select one of the options below:',
        choices: ['View All Departments', 'Add a Department', 'View all Roles', 'Add Role', 'View all Employees', 'Update Employee Role', 'Add Employee', 'Quit'],

    },
];

const addDepartmentPrompt = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'Enter department name:',
        validate: val => /[a-z]/gi.test(val),
    },
];

const addRolePrompt = [
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
        validate: val => /[a-z]/gi.test(val),
    },
    {

        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to:',
        // write code to return the current department list and add it here
        choices: [],

    },
]

const addEmployeePrompt = [
    {
        type: 'input',
        name: 'employeeFirstName',
        message: 'Enter employee\'s first name:',
        validate: val => /[a-z]/gi.test(val),
    },
    {
        type: 'input',
        name: 'employeeLastName',
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
]

const updateEmployeeRolePrompt = [
    {

        type: 'list',
        name: 'employee',
        message: 'Choose the employee you want to update:',
        // write code to return the current department list of employees and add it here
        choices: [],

    },
    {

        type: 'list',
        name: 'newRole',
        message: 'Choose the employee\'s new role:',
        // write code to return the current department list of roles and add it here
        choices: [],

    },
]

function promptUser(questionsArr) {
    return inquirer
        .prompt(
            ...questionsArr,
        ).then((ans) => {
            console.log(ans);
        })
}

promptUser(menuPrompt);