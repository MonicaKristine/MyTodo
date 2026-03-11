const express = require("express");
const request = require("supertest");
const app = express();
const bodyParser = require("body-parser");  
app.use(bodyParser.json());
require('dotenv').config();

const usersRoutes = require("../routes/users");
const todosRoutes = require("../routes/todos");
const categoryRoutes = require("../routes/category");

app.use("/users", usersRoutes);
app.use("/todos", todosRoutes);
app.use("/category", categoryRoutes);

describe('testing-todos-routes', () => {
    let token;
    let categoryId;
    let todoId;

    //Create a new user for test-purposes
    test('POST /users/signup - success', async() => {
        const credentials = { firstName: "Test", lastName: "User", email: "test@user.com", password: "testuser"};
        const { body } = await request(app).post('/users/signup').send(credentials);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe('Successfully created account');
    });

    //1. Logging in with a valid account
    test('POST /users/login - success', async() => {
        const credentials = {email: "test@user.com", password: "testuser"};
        const { body } = await request(app).post('/users/login').send(credentials);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe('Successfully logged in');

        expect(body.data).toHaveProperty('token');
        token = body.data.token;
    });

    //2. Using the token from 1. to get all the users Todos
    test('GET /todos/all - success', async() => {
        const { body } = await request(app)
            .get('/todos/all')
            .set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe('List of all todos');
    });

    //Create a category for test-purposes
    test('POST /category - success', async() => {
        const credentials = { name: 'Test-category'};
        const { body } = await request(app)
            .post('/category')
            .set('Authorization', 'Bearer ' + token)
            .send(credentials);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('id');
        categoryId = body.data.id;
    })

    //3. Using the token from 1. and add a new Todo item
    test('POST /todos - success', async() => {
        const credentials = {name: 'Test application', description: 'Todo for test purposes', CategoryId: categoryId, StatusId: '1'};
        const { body } = await request(app)
            .post('/todos')
            .set('Authorization', 'Bearer ' + token)
            .send(credentials);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe('Todo successfully created');

        expect(body.data).toHaveProperty('id');
        todoId = body.data.id;
    });

    //4. Deleting the created Todo item from number 3
    test('DELETE /todos/:id - success', async() => {
        const { body } = await request(app)
            .delete(`/todos/${todoId}`)
            .set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe(`Todo with id ${todoId} successfully changed status to deleted`);
    });

    //5. Trying to get Todos without sending JWT token in the header
    test('GET /todos - fail', async() => {
        const { body } = await request(app).get('/todos');
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe('JWT token not provided');
    });

    //6. Trying to get Todos by sending an invalid JWT token
    test('GET /todos - fail', async() => {
        const { body } = await request(app)
            .get('/todos')
            .set('Authorization', 'Bearer ' + 1234);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toEqual({
            "name": "JsonWebTokenError",
            "message": "jwt malformed"
        });
    });

    //Delete created todo from database
    test('DELETE /todos/delete/database/:id - success', async() => {
        const { body } = await request(app)
            .delete(`/todos/delete/database/${todoId}`)
            .set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe(`Todo with id ${todoId} successfully deleted`);
    });

    //Delete Test category
    test('DELETE /category/:id - success', async() => {
        const { body } = await request(app)
            .delete(`/category/${categoryId}`)
            .set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe("Category 'Test-category' successfully deleted");
    });

    //Delete Test User
    test('DELETE /users - success', async() => {
        const credentials = {email: "test@user.com", password: "testuser"};
        const { body } = await request(app)
            .delete(`/users`)
            .set('Authorization', 'Bearer ' + token)
            .send(credentials);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe('Your account is deleted.');
    })
});