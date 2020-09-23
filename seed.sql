USE employee_db;

-- Employee's Table

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Eric", "LaFontsee", 1, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brendon", "Conatser", 3, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Chris", "Reed", 3, 4);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Anthony", "Cooper", 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Miller", "Rich", 4, 4);

-- Department TABLE 
INSERT INTO department (name)
VALUES ("HR");
INSERT INTO department (name)
VALUES ("Intern");
INSERT INTO department (name)
VALUES ("Security");
INSERT INTO department (name)
VALUES ("PR");
INSERT INTO department (name)
VALUES ("Sales");


-- Role Table
INSERT INTO role (title, salary, department_id)
VALUES ("Intern", 75000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 50000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Security Officer", 40000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("PR Rep", 50000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Senior Sales Rep", 60000, 5);