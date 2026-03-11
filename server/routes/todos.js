var express = require('express');
var router = express.Router();
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');

const db = require("../models");
let TodoService = require("../services/TodoService");
const todoService = new TodoService(db);
let UserService = require("../services/UserService");
const userService = new UserService(db);
router.use(jsend.middleware);

/* Return all the logged in users todo's with the category associated with each todo and
status that is not the deleted status */
router.get('/', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Returns all the current user todos, that is not deleted. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]

	const UserId = req.user.id;
	const user = await userService.getOne(req.user.email);
	if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }

	const todos = await todoService.getAllExceptDeleted(UserId);
	const jsonTodos = todos.map(todo => todo.toJSON());

	res.jsend.success({"statusCode": 200, "result": "List of todos", Todos: jsonTodos});
});

// Return all the users todos including todos with a deleted status
router.get('/all', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Returns all the current user todos, including todos with deleted status. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]

	const UserId = req.user.id;
	const user = await userService.getOne(req.user.email);
	if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }
	const todos = await todoService.getAll(UserId);
	const jsonTodos = todos.map(todo => todo.toJSON());
	res.jsend.success({"statusCode": 200, "result": "List of all todos", Todos: jsonTodos})
});

// Return all the todos with the deleted status
router.get('/deleted', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Returns all the current user todos with status of deleted. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]

	const UserId = req.user.id;
	const user = await userService.getOne(req.user.email);
	if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }
	const deletedTodos = await todoService.getAllDeleted(UserId);
	const jsonTodos = deletedTodos.map(todo => todo.toJSON());
	res.jsend.success({"statusCode": 200, "result": "List of deleted todos", Todos: jsonTodos});
});

// Add a new todo with their category for the logged in user
router.post('/', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Adds a new todo for the current user in category with {categoryId}. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
    /* #swagger.parameters['body'] = {
        "name": "body",
        "in": "body",
            "schema": {
                $ref: "#/definitions/PostTodo"
            }
    }*/
	const UserId = req.user.id;
	const user = await userService.getOne(req.user.email);
	if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }

	const {name, description, CategoryId, StatusId} = req.body;
	if(!name || !description || !CategoryId || !StatusId) {
		return res.status(400).jsend.fail({"statusCode": 400, "result": "Name, description, category and status must be provided"});
	}

	const category = await todoService.getOneCategory(CategoryId);
	if(!category || UserId !== category.UserId) {
		return res.status(400).jsend.fail({"statusCode": 400, "result": "Category does not exist or belongs to another user."});
	}

	const todo = await todoService.create(name, description, CategoryId, StatusId, UserId);
	res.jsend.success({"statusCode": 200, "result": "Todo successfully created", "New Todo": todo, "id": todo.id})
});

// Return all the statuses from the database
router.get('/statuses', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Gets a list of all available statuses. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
	const user = await userService.getOne(req.user.email);
    if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }
	const statuses = await todoService.getStatuses();
	res.jsend.success({"statusCode": 200, "result": "List of all statuses available", Statuses: statuses})
});

// Change/update a specific todo for logged in user
router.put('/:id', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Updates todo with {id} for the current user. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
    /* #swagger.parameters['body'] = {
        "name": "body",
        "in": "body",
            "schema": {
                $ref: "#/definitions/PutTodo"
            }
    }*/
	const UserId = req.user.id;
	const todoId = req.params.id;
	const {newName, newDescription, newStatusId, newCategoryId} = req.body;

	if(!newName && !newDescription && !newStatusId && !newCategoryId) {
		return res.status(400).jsend.fail({"statusCode": 400, "result": "Update at least one field (newName, newDescription, newStatusId or newCategoryId"})
	}

	const user = await userService.getOne(req.user.email);
    if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }
	const todo = await todoService.getOneTodo(todoId);
	if(!todo) {
		return res.status(404).jsend.fail({"statusCode": 404, "result": "Todo not found"})
	}

	todo.name = newName ?? todo.name;
	todo.description = newDescription  ?? todo.description ;
	todo.StatusId = newStatusId ?? todo.StatusId;
	todo.CategoryId = newCategoryId ?? todo.CategoryId;

	const status = await todoService.getOneStatus(todo.StatusId);
	if(!status) {
		return res.status(404).jsend.fail({"statusCode": 404, "result": "New status not found"})
	}
	const category = await todoService.getOneCategory(todo.CategoryId);
	if(!category) {
		return res.status(404).jsend.fail({"statusCode": 404, "result": "New category not found"})
	}

	await todoService.updateTodo(UserId, todoId, todo.name, todo.description, todo.StatusId, todo.CategoryId);
	res.jsend.success({"statusCode": 200, "result": "Todo successfully updated", "Todo": todo});
});

// Delete a specific todo if for the logged in user
router.delete('/:id', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Sets status to 'deleted' for todo with {id}. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]

	const UserId = req.user.id;
	const user = await userService.getOne(req.user.email);
    if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }

	const todoId = req.params.id;
	const todo = await todoService.getOneTodo(todoId);
	if(!todo) {
		return res.status(404).jsend.fail({"statusCode": 404, "result": "Todo not found"})
	}

	const status = await todoService.getOneStatusByName('Deleted');

	await todoService.delete(UserId, todoId, status.id);
	res.jsend.success({"statusCode": 200, "result": `Todo with id ${todoId} successfully changed status to deleted`})
});

// Delete a specific todo from database (for test purposes)
router.delete('/delete/database/:id', isAuth, async (req, res) => { 
	// #swagger.tags = ['Todos']
    // #swagger.description = "Deletes a todo with {id} from the database. This endpoint is made for testing purposes. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
    const UserId = req.user.id; 
	const user = await userService.getOne(req.user.email);
    if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }

    const todoId = req.params.id; 
    const todo = await todoService.getOneTodo(todoId); 
    if(!todo || UserId !== todo.UserId) { 
        return res.jsend.fail({"statusCode": 400, "result": "Todo not found or belongs to another user"}) 
    } 

    await todoService.deleteFromDatabase(UserId, todoId); 
    res.jsend.success({"statusCode": 200, "result": `Todo with id ${todoId} successfully deleted`}) 
}); 

module.exports = router;

