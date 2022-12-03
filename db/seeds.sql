INSERT INTO department (department_name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales'); 

INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 1),
       ('Software Engineer', 120000, 1),
       ('Legal Team Lead', 250000, 3),
       ('Lawyer', 190000, 3),
       ('Account Manager', 160000, 2), 
       ('Accountant', 125000, 2),
       ('Head of Sales', 100000, 4),
       ('Salesperson', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Doctor', 'Bunsen', 1, null),
       ('Beaker', 'Mehmehm', 2, 1),
       ('Miss', 'Piggy', 3, null),
       ('Scooter', 'McMuppet', 4, 3),
       ('Animal', 'the Drummer', 4, 3),
       ('Sam', 'Eagle', 5, null),
       ('Kermit', 'the Frog', 6, 5),
       ('Camilla', 'the Chicken', 6, 5),
       ('Fozzie', 'the Bear', 7, null),
       ('Gonzo', 'the Gonzo', 8, 7),
       ('Rizzo', 'the Rat', 8, 7); 