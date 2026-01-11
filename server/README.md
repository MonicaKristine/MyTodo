# Noroff

## Back-end Development Year 1

### REST API - Course Assignment 1 <sup>V2</sup>

## This is the **backend** for the Todo List application. This was part of a Cours Assignment in the REST API Course.

# Application Installation and Usage Instructions

Clone the repository:
$ git clone https://github.com/MonicaKristine/MyTodo.git

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
