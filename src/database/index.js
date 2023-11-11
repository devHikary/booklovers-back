const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const Goal = require('../models/Goal');
const Book = require('../models/Book');
const Annotation = require('../models/Annotation');
const Tag = require('../models/Tag');
const List = require('../models/List');
const ListBook = require('../models/ListBook');
const Author = require('../models/Author');
const Theme = require('../models/Theme');
const ReportFailure = require('../models/ReportFailure');

const connection = new Sequelize(dbConfig);

User.init(connection);
Permission.init(connection);
Role.init(connection);
Goal.init(connection);
Book.init(connection);
Annotation.init(connection);
Tag.init(connection);
List.init(connection);
ListBook.init(connection);
Author.init(connection);
Theme.init(connection);
ReportFailure.init(connection);

Permission.associate(connection.models);
Role.associate(connection.models);
User.associate(connection.models);
Goal.associate(connection.models);
Book.associate(connection.models);
Annotation.associate(connection.models);
Tag.associate(connection.models);
List.associate(connection.models);
ListBook.associate(connection.models);
Author.associate(connection.models);
Theme.associate(connection.models);
ReportFailure.associate(connection.models);

module.exports = connection;