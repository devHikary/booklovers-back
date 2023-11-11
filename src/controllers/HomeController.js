const { Op } = require("sequelize");
const { findAll } = require("../models/Annotation");
const Book = require("../models/Book");
const Annotation = require("../models/Annotation");

const TODAY_START = new Date().setHours(0, 0, 0, 0);
const NOW = new Date();

module.exports = {
  
};
