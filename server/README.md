[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YshuTcfA)

![](http://143.42.108.232/pvt/Noroff-64.png)

# Noroff

## Back-end Development Year 1

### REST API - Course Assignment 1 <sup>V2</sup>

Startup code for Noroff back-end development 1 - REST API course.

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://143.42.108.232/pvt/important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://143.42.108.232/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

# Application Installation and Usage Instructions

Clone the repository:
$ git clone https://github.com/noroff-backend-1/mar25ft-api-ca-1-MonicaKristine.git

The application uses Expressjs.

Create the database using MySQL Workbench:
CREATE DATABASE myTodo;
GRANT SELECT, INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, REFERENCES ON myTodo.\* TO 'admin_user'@'localhost';
Fill in nesecarry environment variables in the .env file using the env_example or copy the environment variables below.

**npm install** to install dependencies.

Type 'npm start' in the terminal. The first time the database will be populated with tables and statuses.
The server is running on http://localhost:3000/. **PORT 3000**

Documentation:
Documentation is automatically generated with npm start.
Go to http://localhost:3000/doc to find swagger documentation.

Testing:
**npm test** in terminal to run test file for todos.

# Environment Variables

HOST = "localhost"

ADMIN_USERNAME = ""

ADMIN_PASSWORD = ""

DATABASE_NAME = "myTodo"

DIALECT = "mysql"

PORT = "3000"

TOKEN_SECRET=

# Additional Libraries/Packages

- mySql, mySql2 and sequelize for database setup
- jsonwebtoken for JWT authentication
- jsend for error and validation handling
- jest and supertest for automated testing
- swagger-autogen and swagger-ui-express for documentation

# NodeJS Version Used

**Node.js v22.16.0**
