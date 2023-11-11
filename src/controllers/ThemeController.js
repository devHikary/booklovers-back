const crypto = require("crypto");
const Book = require("../models/Book");
const Author = require("../models/Author");
const Theme = require("../models/Theme");
const Annotation = require("../models/Annotation");
const { Op } = require("sequelize");
const Tag = require("../models/Tag");

module.exports = {
  async getAll(req, res) {
    try {
      const theme = await Theme.findAll({attributes: ['id','name']});

      return res.json(theme);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;

      const id = crypto.randomUUID();

      const name_aux = await Theme.findOne({
        where: {
          name: name,
        },
      });

      if (name_aux)
        return res.status(400).json({ error: "Registro duplicado" });

      const theme = await Theme.create({
        id,
        name
      });

      return res.json(theme);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getByIdUser(req, res) {
    try {
      const { id, user_id } = req.query;
      let result = [];

      const books = await Book.findAll(
        {
          include: [
            {
              model: Author,
              attributes: ["id", "name"],
              through: {
                attributes: [],
              },
            },
            {
              model: Theme,
              attributes: ["id", "name"],
              where: {id: id},
              through: {
                attributes: [],
              },
            },
          ],
        }
      );
      for(let book of books){
        const annotation = await Annotation.findOne(
          {
            attributes: ["id","pages_read", "progress", "rating", "review", "date_start", "date_end", "favorite"],
            where: {
              [Op.and]: [{ book_id: book.id }, { user_id: user_id }],
            },
            include: [
              {
                association: 'tags',
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
          },
        );
        if(annotation)
          result.push({book: book, annotation: annotation})
      }


      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getById(req, res) {
    try {
      const { id, user_id } = req.query;
      let result = [];

      const books = await Book.findAll(
        {
          include: [
            {
              model: Author,
              attributes: ["id", "name"],
              through: {
                attributes: [],
              },
            },
            {
              model: Theme,
              attributes: ["id", "name"],
              where: {id: id},
              through: {
                attributes: [],
              },
            },
          ],
        }
      );
      for(let book of books){
        const annotation = await Annotation.findOne(
          {
            attributes: ["id","pages_read", "progress", "rating", "review", "date_start", "date_end", "favorite"],
            where: {
              [Op.and]: [{ book_id: book.id }, { user_id: user_id }],
            },
            include: [
              {
                association: 'tags',
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
          },
        );
          result.push({book: book, annotation: annotation})
      }


      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
