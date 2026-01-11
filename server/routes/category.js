var express = require('express');
var router = express.Router();
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');

var db = require("../models");
var CategoryService = require("../services/CategoryService");
const categoryService = new CategoryService(db);
var UserService = require("../services/UserService");
const userService = new UserService(db);

router.use(jsend.middleware);

/* Return all categories */
router.get('/', isAuth, async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = "Gets the list of all categories available for the current user. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
	const UserId = req.user.id;
    const user = await userService.getOne(req.user.email);
    if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }
    let categories = await categoryService.getCategories(UserId);
    res.status(200).jsend.success({"statusCode": 200, "result": `List of categories for user with id ${UserId}`, Categories: categories});
});

/* Add a new category */
router.post('/', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Category']
    // #swagger.description = "Creates a new category for the current user. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
    /* #swagger.parameters['body'] = {
        "name": "body",
        "in": "body",
            "schema": {
                $ref: "#/definitions/PostCategory"
            }
    }*/
	const {name} = req.body;
    if(!name) {
        return res.status(400).jsend.fail({"statusCode": 400, "result": "name is required"})
    }

    const UserId = req.user.id;
    const user = await userService.getOne(req.user.email);
    if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }

    const category = await categoryService.addCategory(name, UserId);
    res.status(200).jsend.success({"statusCode": 200, "result": "Category added successfully", "New Category": name, "id": category.id});
});

/* Edit a spesific category */
router.put('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = "Edits the name of category with {id} for the current user. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
    /* #swagger.parameters['body'] = {
        "name": "body",
        "in": "body",
            "schema": {
                $ref: "#/definitions/PutCategory"
            }
    }*/
    const UserId = req.user.id;
    const user = await userService.getOne(req.user.email);
    if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }
	const categoryId = req.params.id;
    const category = await categoryService.getOne(categoryId);
    if(!category || UserId !== category.UserId) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "Category not found or belongs to another user"});
    }
    const {newName} = req.body;
    if(!newName) {
        res.status(400).jsend.fail({"statusCode": 400, "result": "Please provide the new name of this category"});
    }

    await categoryService.updateName(categoryId, newName, UserId);
    res.jsend.success({"statusCode": 200, "result": "Category successfully updated", "New Name": newName});
});

/* Delete a category */
router.delete('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Category']
    // #swagger.description = "Deletes a category with {id} for the current user. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
   
    const UserId = req.user.id;
    const user = await userService.getOne(req.user.email);
    if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }
	const categoryId = req.params.id;
    const category = await categoryService.getOne(categoryId);
    if(!category || UserId !== category.UserId) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "Category not found or belings to another user"});
    }

    const dependent = await categoryService.checkIfDepedent(categoryId);
    if(!dependent) {
        await categoryService.delete(categoryId, UserId);
        res.jsend.success({"statusCode": 200, "result": `Category '${category.name}' successfully deleted`})
    } else {
        res.status(409).jsend.fail({"statusCode": 409, "result": "Cannot be deleted - has been assigned to a todo"});
    }

});

module.exports = router;