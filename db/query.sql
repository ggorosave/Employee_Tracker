USE muppetsInc_db;

SELECT e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS Title, r.salary AS Salary, d.department_name AS Department
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id;

-- Figure out GROUP BY

SELECT d.department_name as Department
FROM department d;