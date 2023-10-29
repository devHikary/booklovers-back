const express = require('express');
	
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const UserController = require('./controllers/UserController');
const PermissionController = require('./controllers/PermissionController');
const RoleController = require('./controllers/RoleController');
const GoalController = require('./controllers/GoalController');
const BookController = require('./controllers/BookController');
const AnnotationController = require('./controllers/AnnotationController');
const TagController = require('./controllers/TagController');
const ListController = require('./controllers/ListController');
const AuthorController = require('./controllers/AuthorController');
const ThemeController = require('./controllers/ThemeController');
const LoginController = require('./controllers/LoginController');

const routes = express.Router();

routes.get('/users', UserController.getAll);
routes.post('/users', UserController.create);

routes.get('/permissions', PermissionController.getAll);
routes.post('/permissions', PermissionController.create);

routes.get('/roles', RoleController.getAll);
routes.post('/roles', RoleController.create);

routes.get('/goals', GoalController.getAll);
routes.post('/goals', GoalController.create);

routes.get('/books', BookController.getAll);
routes.post('/books', BookController.create);
routes.put('/books', BookController.update);
routes.get('/books/:id', BookController.getById);
routes.get('/books/title/:title', BookController.getByTitle);

routes.get('/annotations', AnnotationController.getAll);
routes.post('/annotations', AnnotationController.create);
routes.put('/annotations', AnnotationController.update);

routes.get('/tags', TagController.getAll);
routes.post('/tags', TagController.create);

routes.get('/authors', AuthorController.getAll);
routes.post('/authors', AuthorController.create);

routes.get('/themes', ThemeController.getAll);
routes.post('/themes', ThemeController.create);
routes.get('/themes/:id', ThemeController.getById);

routes.get('/lists', ListController.getAll);
routes.post('/lists', ListController.create);
routes.post('/lists/:id', ListController.pushBook);
routes.get('/lists/:id', ListController.getBooks);

routes.post('/login', LoginController.auth);

module.exports = routes;