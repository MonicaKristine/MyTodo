var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const bodyParser = require('body-parser');

var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos');
var categoryRouter = require('./routes/category');

require('dotenv').config();
var db = require('./models');
const insertStatus = require('./data/statusRecords');

//Insert statuses to Status table
async function populteStatus() {
	try {
		await db.sequelize.sync({ force: false });
		await insertStatus();
	} catch(err) {
		console.error(err);
	}
}
populteStatus();

var app = express();

//Conecting to client
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Swagger documentation /doc
app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);
app.use('/api/category', categoryRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

module.exports = app;

