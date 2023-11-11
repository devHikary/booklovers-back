const crypto = require("crypto");
const Author = require("../models/Author");
const Book = require("../models/Book");
const Annotation = require("../models/Annotation");
const Theme = require("../models/Theme");
const { Op } = require("sequelize");

module.exports = {
  async getAll(req, res) {
    try {
      const author = await Author.findAll({
        order: [['name', 'ASC']],
      });

      return res.json(author);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;

      const id = crypto.randomUUID();

      const name_aux = await Author.findOne({
        where: {
          name: name,
        },
      });

      if (name_aux)
        return res.status(400).json({ error: "Registro duplicado" });

      const author = await Author.create({
        id,
        name
      });

      return res.json(author);
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
              where: {id: id},
              attributes: ["id", "name"],
              through: {
                attributes: [],
              },
            },
            {
              model: Theme,
              attributes: ["id", "name"],
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
              where: {id: id},
              attributes: ["id", "name"],
              through: {
                attributes: [],
              },
            },
            {
              model: Theme,
              attributes: ["id", "name"],
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
