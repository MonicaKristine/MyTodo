var express = require('express');
var router = express.Router();
var jsend = require('jsend');
require('dotenv').config();

var db = require('../models');
var UserService = require('../services/UserService');
var userService = new UserService(db);
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
router.use(jsend.middleware);
const isAuth = require('../middleware/middleware');

//Get user details from token
router.get('/user', isAuth, (req, res, next) => {
    res.json({user: req.user});
})

// Post for registered users to be able to login
router.post('/login', jsonParser, async (req, res, next) => {
	
	// #swagger.tags = ['Users']
    // #swagger.description = "Logs in user with correct email and password"
    /* #swagger.parameters['body'] = {
        "name": "body",
        "in": "body",
            "schema": {
                $ref: "#/definitions/Login"
            }
    }*/

	const { email, password } = req.body;
	if(!email || !password) {
		return res.status(400).jsend.fail({"statusCode": 400, "result": "email and password is required"});
	}
	userService.getOne(email).then((data) => {
		if(data === null) {
			return res.status(400).jsend.fail({"statusCode": 400, "result": "Incorrect email or password"});
		}
		crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
			if(err) {return next(err);}
			if(!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
				return res.status(400).jsend.fail({"statusCode": 400, "result": "Incorrect email or password"});
			}
			let token;
			try {
				token = jwt.sign(
					{id: data.id, email: data.email, name: data.name}, process.env.TOKEN_SECRET, { expiresIn: "1h" } 
				);
			} catch(err) {
				res.jsend.error("JWT token was not created");
			}
			res.jsend.success({"statusCode": 200, "result": "Successfully logged in", user: {
                id: data.id, 
                email: data.email,
                name: data.name
            }, token});
		});
	});
});

// Post for new users to register / signup
router.post('/signup', jsonParser, async (req, res, next) => {
	// #swagger.tags = ['Users']
    // #swagger.description = "Creates a new user."
    /* #swagger.parameters['body'] = {
        "name": "body",
        "in": "body",
            "schema": {
                $ref: "#/definitions/Signup"
            }
    }*/
	const {firstName, lastName, email, password} = req.body;
	if (!firstName || !lastName || !email || !password) {
		return res.status(400).jsend.fail({"statusCode": 400, "result": "There was an error to create your account. You need to specify your name, email and password!"});
	}

	const name = firstName + ' ' + lastName;
	let user = await userService.getOne(email);
	if(user) {
		return res.status(409).jsend.fail({"statusCode": 409, "result": "Provided email is already in use"})
	}

	var salt = crypto.randomBytes(16);
	crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
		if(err) {return next(err);} 
		userService.create(name, email, hashedPassword, salt);
		res.jsend.success({"statusCode": 200, "result": "Successfully created account"});
	})
});

//Delete account from database (for test purposes)
router.delete('/', isAuth, async (req, res, next) => {
	// #swagger.tags = ['Users']
    // #swagger.description = "Deletes the current user from the database. Made for test purposes. The user cannot have any dependent categories. User needs to be authorized with 'Bearer {token}' from login."
    // #swagger.security = [{ "BearerAuth": []}]
	/* #swagger.parameters['body'] = {
        "name": "body",
        "in": "body",
            "schema": {
                $ref: "#/definitions/Login"
            }
    }*/

	let UserId = req.user.id;
	const user = await userService.getOne(req.user.email);
	if(!user) {
        return res.status(404).jsend.fail({"statusCode": 404, "result": "User not found"});
    }

	const { email, password } = req.body;
	if(!email || !password) {
		return res.status(400).jsend.fail({"statusCode": 400, "result": "email and password is required"});
	}
	userService.getOne(email).then((data) => {
		if(data === null) {
			return res.status(400).jsend.fail({"statusCode": 400, "result": "Incorrect email or password"});
		}
		crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
			if(err) {return next(err);}
			if(!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
				return res.status(400).jsend.fail({"statusCode": 400, "result": "Incorrect email or password"});
			}
		});
		if(data.id !== UserId) {
			return res.status(401).jsend.fail({"statusCode": 401, "result": "Must be logged in to delete your account"})
		}
	});

	const dependent = await userService.checkIfDepedent(UserId);
	if(!dependent) {
		await userService.delete(UserId);
		res.jsend.success({"statusCode": 200, "result": "Your account is deleted."})
	} else {
		res.status(409).jsend.fail({"statusCode": 409, "result": "Cannot be deleted - has a dependent category"});
	}
})

router.get('/fail', (req, res) => {
	// #swagger.tags = ['Error']
    // #swagger.description = "Produces an error message"
	return res.status(401).jsend.error({ statusCode: 401, message: 'message', data: 'data' });
});

module.exports = router;

