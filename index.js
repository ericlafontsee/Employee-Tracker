var { prompt } = require("inquirer");
const Choices = require("inquirer/lib/objects/choices");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    start();
});

function start() {
    prompt({
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Remove Employee",
                "Remove Department",
                "Remove Role",
                "Update Employee Role",
                "Update Employee Manager",
                "View All Roles"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Employees By Department":
                    viewDepartment();
                    break;
                case "View All Employees By Manager":
                    viewManager();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Remove Department":
                    removeDepartment();
                    break;
                case "Remove Role":
                    removeRole();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Update Employee Manager":
                    updateManager();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "exit":
                    connection.end();
                    break;
            }
        });
}

function viewEmployees() {
    connection.query(`
        SELECT * FROM employee
         `, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

function viewDepartment() {
    connection.query(`
        SELECT * FROM department
         `, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

function viewManager() {
    connection.query(`
        SELECT * FROM 
         `, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

function addEmployee() {
    prompt([

            {
                name: "firstName",
                message: "What is the first name of the employee?"
            },
            {
                name: "lastName",
                message: "What is the last name of the employee?"

            },
            {
                name: "roleId",
                type: "list",
                message: "What is the employee's role ID?",
                choices: [
                    1,
                    2,
                    3,
                    4,
                    5
                ]

            },
            {
                name: "managerId",
                type: "list",
                message: "What is the employee's manager's ID?",
                choices: [
                    1,
                    2,
                    3
                ]

            },
        ])
        .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleId,
                    manager_id: answer.managerId
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("----------------------\n" + res.affectedRows + " Employee Added!\n");
                    start();
                }
            );
        });
};

function addDepartment() {
    prompt([

            {
                name: "departName",
                message: "What is the name of the department?"
            }
        ])
        .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?", {
                    name: answer.departName
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("----------------------\n" + res.affectedRows + " Department Added!\n");
                    start();
                }
            );
        });
}

function addRole() {
    prompt([{
                name: "roleTitle",
                message: "What is the title of the role?"
            },
            {
                name: "salary",
                message: "What is the salary of the role?"

            },
            {
                name: "departmentId",
                message: "What is the role ID?"

            },
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO role SET ?", {
                    title: answer.roleTitle,
                    salary: answer.salary,
                    department_id: answer.departmentId
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("----------------------\n" + res.affectedRows + " Role Added!\n");
                    start();
                }
            );
        });
};

function removeEmployee() {
    prompt([{
            name: "lastName",
            message: "What is the last name of the employee you'd like to remove?"

        }])
        .then(function(answer) {
            connection.query(
                "DELETE FROM employee WHERE ?", [{
                    last_name: answer.lastName
                }],
                function(err, res) {
                    if (err) throw err;
                    console.log("----------------------\n" + res.affectedRows + " Employee Removed!\n");
                    start();
                }
            );
        });

};

function removeDepartment() {
    prompt([{
            name: "departName",
            message: "What is thename of the department you'd like to remove?"

        }])
        .then(function(answer) {
            connection.query(
                "DELETE FROM department WHERE ?", [{
                    name: answer.departName
                }],
                function(err, res) {
                    if (err) throw err;
                    console.log("----------------------\n" + res.affectedRows + " Department Removed!\n");
                    start();
                }
            );
        });

};

function removeRole() {
    prompt([{
            name: "roleTitle",
            message: "What is the title of the role you'd like to remove?"

        }])
        .then(function(answer) {
            connection.query(
                "DELETE FROM role WHERE ?", [{
                    title: answer.roleTitle
                }],
                function(err, res) {
                    if (err) throw err;
                    console.log("----------------------\n" + res.affectedRows + " Role Removed!\n");
                    start();
                }
            );
        });

};