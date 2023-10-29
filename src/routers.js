const express = require('express');
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
const middlewares = require('./middleware/middlewares');

const routes = express.Router();

routes.get('/users', middlewares.verifyToken, UserController.getAll);
routes.post('/users', UserController.create);

routes.get('/permissions', middlewares.verifyToken, PermissionController.getAll);
routes.post('/permissions', middlewares.verifyToken, PermissionController.create);

routes.get('/roles', middlewares.verifyToken, RoleController.getAll);
routes.post('/roles', middlewares.verifyToken, RoleController.create);
routes.put('/roles', middlewares.verifyToken, RoleController.update);

routes.get('/goals', middlewares.verifyToken, GoalController.getAll);
routes.post('/goals', middlewares.verifyToken, GoalController.create);

routes.get('/books', middlewares.verifyToken, BookController.getAll);
routes.post('/books',middlewares.verifyToken,  BookController.create);
routes.put('/books', middlewares.verifyToken, BookController.update);
routes.get('/books/:id', middlewares.verifyToken, BookController.getById);
routes.get('/books/title/:title', middlewares.verifyToken, BookController.getByTitle);

routes.get('/annotations', middlewares.verifyToken, AnnotationController.getAll);
routes.post('/annotations', middlewares.verifyToken, AnnotationController.create);
routes.put('/annotations', middlewares.verifyToken, AnnotationController.update);

routes.get('/tags', middlewares.verifyToken, TagController.getAll);
routes.post('/tags', middlewares.verifyToken, TagController.create);

routes.get('/authors', middlewares.verifyToken, AuthorController.getAll);
routes.post('/authors', middlewares.verifyToken, AuthorController.create);

routes.get('/themes', middlewares.verifyToken, ThemeController.getAll);
routes.post('/themes', middlewares.verifyToken, ThemeController.create);
routes.get('/themes/:id', middlewares.verifyToken, ThemeController.getById);

routes.get('/lists', middlewares.verifyToken, ListController.getAll);
routes.post('/lists', middlewares.verifyToken, ListController.create);
routes.post('/lists/:id', middlewares.verifyToken, ListController.pushBook);
routes.get('/lists/:id', middlewares.verifyToken, ListController.getBooks);

routes.post('/login', LoginController.auth);




module.exports = routes;