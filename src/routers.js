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
const homeController = require('./controllers/homeController');
const StatisticController = require('./controllers/StatisticController');
const ReportFailureController = require('./controllers/ReportFailureController');


const routes = express.Router();

routes.post('/users', UserController.create);
routes.put('/users', middlewares.verifyToken, UserController.update);
routes.get('/users', middlewares.verifyToken, UserController.getAll);
routes.get('/users/:id', middlewares.verifyToken, UserController.getById);
routes.delete('/users/:id', middlewares.verifyToken, UserController.delete);
routes.put('/users/updatePwd', middlewares.verifyToken, UserController.updatePwd);

routes.post('/permissions', middlewares.verifyToken, PermissionController.create);
routes.put('/permissions', middlewares.verifyToken, PermissionController.update);
routes.get('/permissions', middlewares.verifyToken, PermissionController.getAll);
routes.get('/permissions/:id', middlewares.verifyToken, PermissionController.getById);
routes.delete('/permissions/:id', middlewares.verifyToken, PermissionController.delete);

routes.post('/roles', middlewares.verifyToken, RoleController.create); 
routes.put('/roles', middlewares.verifyToken, RoleController.update);
routes.get('/roles', middlewares.verifyToken, RoleController.getAll);
routes.get('/roles/:id', middlewares.verifyToken, RoleController.getById);
routes.delete('/roles/:id', middlewares.verifyToken, RoleController.delete);

routes.post('/goals', middlewares.verifyToken, GoalController.create);
routes.put('/goals', middlewares.verifyToken, GoalController.update);
routes.get('/goals/:id', middlewares.verifyToken, GoalController.getById);
routes.delete('/goals/:id', middlewares.verifyToken, GoalController.deleteById);
routes.get('/goals/u/:user_id', middlewares.verifyToken, GoalController.getAll);
routes.get('/goals/s/andamento/:user_id', middlewares.verifyToken, GoalController.getAndamento);

routes.post('/books',middlewares.verifyToken,  BookController.create);
routes.put('/books', middlewares.verifyToken, BookController.update);
routes.get('/books/id/:id', middlewares.verifyToken, BookController.getById);
routes.get('/books/:user_id', middlewares.verifyToken, BookController.getAll);
routes.get('/books/:id/u/:user_id', middlewares.verifyToken, BookController.getByIdUser);
routes.get('/books/title/t', middlewares.verifyToken, BookController.getByTitle);

routes.get('/annotations', middlewares.verifyToken, AnnotationController.getAll);
routes.post('/annotations', middlewares.verifyToken, AnnotationController.create);
routes.put('/annotations', middlewares.verifyToken, AnnotationController.update);
routes.get('/annotations/finished/:user_id', AnnotationController.getFinished);
routes.get('/annotations/favorite/:user_id', AnnotationController.getFavorite);
routes.get('/annotations/reading/:user_id', AnnotationController.getReading);
routes.get('/annotations/rating', AnnotationController.getRating);
routes.get('/annotations/theme', AnnotationController.getAllByTheme);
routes.get('/annotations/author', AnnotationController.getAllByAuthor);

routes.get('/tags', middlewares.verifyToken, TagController.getAll);
routes.get('/tags/user/:user_id', middlewares.verifyToken, TagController.getAllUser);
routes.post('/tags', middlewares.verifyToken, TagController.create);
routes.put('/tags', middlewares.verifyToken, TagController.update);
routes.delete('/tags/:id', middlewares.verifyToken, TagController.delete);
routes.get('/tags/:id/u/:user_id', middlewares.verifyToken, TagController.getById);

routes.get('/authors', middlewares.verifyToken, AuthorController.getAll);
routes.post('/authors', middlewares.verifyToken, AuthorController.create);
routes.put('/authors', middlewares.verifyToken, AuthorController.update);
routes.delete('/authors/:id', middlewares.verifyToken, AuthorController.delete);
routes.get('/authors/u', middlewares.verifyToken, AuthorController.getByIdUser);
routes.get('/authors/:id', middlewares.verifyToken, AuthorController.getById);

routes.get('/themes', middlewares.verifyToken, ThemeController.getAll);
routes.post('/themes', middlewares.verifyToken, ThemeController.create);
routes.put('/themes', middlewares.verifyToken, ThemeController.update);
routes.delete('/themes/:id', middlewares.verifyToken, ThemeController.delete);
routes.get('/themes/u', middlewares.verifyToken, ThemeController.getByIdUser);
routes.get('/themes/:id', middlewares.verifyToken, ThemeController.getById);

routes.get('/lists/myl/:user_id', middlewares.verifyToken, ListController.getAll);
routes.get('/lists/myb/:user_id', middlewares.verifyToken, ListController.getAllBooks);
routes.post('/lists', middlewares.verifyToken, ListController.create);
// routes.put('/lists', middlewares.verifyToken, ListController.update);
routes.post('/lists/book/', middlewares.verifyToken, ListController.pushBook);
routes.get('/lists/:id', middlewares.verifyToken, ListController.getBooks);
routes.delete('/lists/:id', middlewares.verifyToken, ListController.delete);

routes.get('/statistic/month/:user_id', middlewares.verifyToken, StatisticController.getMonth);
routes.get('/statistic/year/:user_id', middlewares.verifyToken, StatisticController.getYear);
routes.get('/statistic/rating', middlewares.verifyToken, StatisticController.getRating);
routes.get('/statistic/theme', middlewares.verifyToken, StatisticController.getTheme);
routes.get('/statistic/favorite', middlewares.verifyToken, StatisticController.getFavorites);

routes.post('/reportFailures', middlewares.verifyToken, ReportFailureController.create);
routes.put('/reportFailures', middlewares.verifyToken, ReportFailureController.update);
routes.get('/reportFailures', middlewares.verifyToken, ReportFailureController.getAll);
routes.get('/reportFailures/:id', middlewares.verifyToken, ReportFailureController.getById);


routes.post('/login', LoginController.auth);




module.exports = routes;