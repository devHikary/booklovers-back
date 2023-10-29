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

routes.get('/books/:user_id', middlewares.verifyToken, BookController.getAll);
routes.post('/books',middlewares.verifyToken,  BookController.create);
routes.put('/books', middlewares.verifyToken, BookController.update);
routes.get('/books/id/:id', middlewares.verifyToken, BookController.getById);
routes.get('/books/:id/u/:user_id', middlewares.verifyToken, BookController.getByIdUser);
// routes.get('/books/title/:title/u/:user_id', middlewares.verifyToken, BookController.getByTitle);
routes.get('/books/title/t', middlewares.verifyToken, BookController.getByTitle);

routes.get('/annotations', middlewares.verifyToken, AnnotationController.getAll);
routes.post('/annotations', middlewares.verifyToken, AnnotationController.create);
routes.put('/annotations', middlewares.verifyToken, AnnotationController.update);

routes.get('/tags', middlewares.verifyToken, TagController.getAll);
routes.get('/tags/user/:user_id', middlewares.verifyToken, TagController.getAllUser);
routes.post('/tags', middlewares.verifyToken, TagController.create);
routes.put('/tags', middlewares.verifyToken, TagController.update);
routes.delete('/tags/:id', middlewares.verifyToken, TagController.delete);
routes.get('/tags/:id/u/:user_id', middlewares.verifyToken, TagController.getById);

routes.get('/authors', middlewares.verifyToken, AuthorController.getAll);
routes.post('/authors', middlewares.verifyToken, AuthorController.create);

routes.get('/themes', middlewares.verifyToken, ThemeController.getAll);
routes.post('/themes', middlewares.verifyToken, ThemeController.create);
routes.get('/themes/:id/u/:user_id', middlewares.verifyToken, ThemeController.getById);

routes.get('/lists/myl/:user_id', middlewares.verifyToken, ListController.getAll);
routes.get('/lists/myb/:user_id', middlewares.verifyToken, ListController.getAllBooks);
routes.post('/lists', middlewares.verifyToken, ListController.create);
// routes.put('/lists', middlewares.verifyToken, ListController.update);
routes.post('/lists/book/', middlewares.verifyToken, ListController.pushBook);
routes.get('/lists/:id', middlewares.verifyToken, ListController.getBooks);
routes.delete('/lists/:id', middlewares.verifyToken, ListController.delete);

routes.post('/login', LoginController.auth);




module.exports = routes;