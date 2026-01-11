var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const jsend = require('jsend');
router.use(jsend.middleware);

// Middleware function to determine if the API endpoint request is from an authenticated user
function isAuth(req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];
	if(!token) {
		return res.status(401).jsend.fail({"statusCode": 401, "result": "JWT token not provided"});
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
	} catch(err) {
		return res.status(403).jsend.fail({"result": err});
	}

	req.user = decodedToken;
	next();
}

module.exports = isAuth;