const inquirer = require("inquirer");
const { prompt } = require("inquirer");
const mysql = require("mysql");
var term = require('terminal-kit').terminal;
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    term.slowTyping(
        'WELCOME TO EMPLOYEE TRACKER!\n', { flashStyle: term.brightWhite },
        function() { start(); }
    );
});


function start() {

    prompt({
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Remove Employee",
                "Remove Department",
                "Remove Role",
                "Update Employee Role",
                "Update Employee Manager"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "View All Departments":
                    viewDepartment();
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
                    getEmployees();
                    break;
                case "Remove Department":
                    getDepartmentIds();
                    break;
                case "Remove Role":
                    getRoleList();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Update Employee Manager":
                    updateManager();
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

function viewRoles() {
    connection.query(`
        SELECT * FROM role
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


function addEmployee() {
    connection.query(`
            SELECT id, title FROM role
             `, function(err, res) {
        if (err) throw err;
        var roleId = [];
        var titleList = [];
        for (var i = 0; i < res.length; i++) {
            roleId.push(res[i].id);
            titleList.push(res[i].title);
        }
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
                    message: "What is the employee's role?",
                    choices: titleList
                },
                {
                    name: "managerId",
                    type: "list",
                    message: "What is the employee's manager's ID?",
                    choices: [
                        2
                    ]

                },
            ])
            .then(function(answer) {
                var i = titleList.indexOf(answer.roleId);
                connection.query(
                    "INSERT INTO employee SET ?", {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: roleId[i],
                        manager_id: answer.managerId
                    },
                    function(err, res) {
                        if (err) throw err;
                        console.log("----------------------\n" + res.affectedRows + " Employee Added!\n");
                        start();
                    }
                );
            });

    });
}


function addDepartment() {
    prompt([{
            name: "departName",
            message: "What is the name of the department?"
        }])
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
                message: "What is the department ID?"

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

function getEmployees() {
    connection.query(`
    SELECT last_name FROM employee
     `, function(err, res) {
        if (err) throw err;
        var employeeName = [];
        for (var i = 0; i < res.length; i++) {
            employeeName.push(res[i].last_name);
        }
        removeEmployee({ name: employeeName });
    });
}

function removeEmployee(employees) {
    console.log(employees);
    prompt([{
            name: "lastName",
            message: "What is the last name of the employee you'd like to remove?",
            choices: employees.name,
            type: "list"

        }])
        .then(function(answer) {
            var i = employees.name.indexOf(answer.lastName);
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

function getDepartmentIds() {
    connection.query(`
    SELECT id, name FROM department
     `, function(err, res) {
        if (err) throw err;
        var departID = [];
        var departName = [];
        for (var i = 0; i < res.length; i++) {
            departID.push(res[i].id);
            departName.push(res[i].name);
        }
        removeDepartment({ id: departID, name: departName });

    });
}

function removeDepartment(department) {
    prompt([{
            name: "departName",
            message: "What is thename of the department you'd like to remove?",
            choices: department.name,
            type: "list"

        }])
        .then(function(answer) {
            var i = department.name.indexOf(answer.departName);
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

function getRoleList() {
    connection.query(`
    SELECT title FROM role
     `, function(err, res) {
        if (err) throw err;
        var roleTitle = [];
        for (var i = 0; i < res.length; i++) {
            roleTitle.push(res[i].title);
        }
        removeRole({ title: roleTitle });

    });
}

function removeRole(roleList) {
    prompt([{
            name: "roleTitle",
            message: "What is the title of the role you'd like to remove?",
            choices: roleList.title,
            type: "list"

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

function updateRole() {
    inquirer.prompt([{
            name: "movefrom",
            type: "input",
            message: "ID of the person you want to move:"
        },
        {
            name: "moveto",
            type: "input",
            message: "What is the role ID you want to move them to?"
        }
    ]).then(function(answer) {
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.moveto, answer.movefrom],
            function(err, res) {
                if (err) throw err;
                console.log(res);
                start();
            });
    });
}

function updateManager() {
    inquirer.prompt([{
            name: "switchid",
            type: "input",
            message: "ID of the person you want to change managers for:"
        },
        {
            name: "managerid",
            type: "input",
            message: "What is the id of the manager you want to move them under?"
        }
    ]).then(function(answer) {
        connection.query("UPDATE employees SET manager_id = ? WHERE id = ?", [answer.managerid, answer.switchid],
            function(err, res) {
                if (err) throw err;
                start();
            });
    });
}