# Todo List Application

This repository contains a **Todo List application**

- The **backend** is build using Node.js and Expressjs.
- The **frontend** is built with React and Vite, developed afterwards to interact with the backend.

## Features

### Frontend (Client)

- User sign-up and login
- Some of the functionalities for the todo application (view todos, add categories and todos, delete todos)

### Backend (Server)

- REST API endpoints for todos, categories, and user authentication
- JWT-based authentication
- CRUD operations for todos and categories
- Database setup and management with MySQL
- API documentation via Swagger
- Automated tests for todos

## Tech Stack

**Frontend:**

- React with Vite
- React Router DOM
- Axios for HTTP requests
- Bootstrap & React-Bootstrap for styling

**Backend:**

- Node.js & Express
- MySQL & Sequelize
- JWT authentication
- Jest & Supertest for testing
- Swagger for documentation

## Installation & Usage

Clone the repository:
$ git clone https://github.com/MonicaKristine/MyTodo.git

### Backend Setup

Type 'cd server' in the terminal to change directory to the server folder.

Create the database using MySQL Workbench:
CREATE DATABASE myTodo;
GRANT SELECT, INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, REFERENCES ON myTodo.\* TO 'admin_user'@'localhost';
Fill in nesecarry environment variables in the .env file using the env_example.

**npm install** to install dependencies.

Type 'npm start' in the terminal. The first time the database will be populated with tables and statuses.
The server is running on http://localhost:3000/. **PORT 3000**

Documentation:
Documentation is automatically generated with npm start.
Go to http://localhost:3000/doc to find swagger documentation.

Testing:
**npm test** in terminal to run test file for todos.

### Frontend Setup

Add a new terminal and type 'cd client' to change directory to the client folder.

**npm install** to install dependencies.

Type 'npm run dev' in the client-terminal.
The server is running on http://localhost:5173/. **PORT 5173**
