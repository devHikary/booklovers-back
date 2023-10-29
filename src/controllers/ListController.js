const Annotation = require("../models/Annotation");
const crypto = require("crypto");
const User = require("../models/User");
const Book = require("../models/Book");
const List = require("../models/List");
const { Op } = require("sequelize");
const Author = require("../models/Author");
const Tag = require("../models/Tag");
const Theme = require("../models/Theme");

module.exports = {
  async getAll(req, res) {
    try {
      const { user_id } = req.params;
      const list = await List.findAll({
        where: { user_id: user_id },
      });

      return res.json(list);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getAllBooks(req, res) {
    try {
      const { user_id } = req.params;
      const result = [];
      const books = await Book.findAll({
        include: {
          model: Author,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      });

      for (let book of books) {
        const annotation = await Annotation.findOne({
          attributes: [
            "id",
            "pages_read",
            "progress",
            "rating",
            "review",
            "date_start",
            "date_end",
            "favorite",
          ],
          where: {
            [Op.and]: [{ book_id: book.id }, { user_id: user_id }],
          },
          include: [
            {
              association: "tags",
              attributes: ["id", "name"],
              through: {
                attributes: [],
              },
            },
          ],
        });
        if (annotation) result.push({ book: book, annotation: annotation });
      }

      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { name, user_id, books } = req.body;

      const id = crypto.randomUUID();

      const name_aux = await List.findOne({
        where: {
          [Op.and]: [{ name: name }, { user_id: user_id }],
        },
      });

      if (name_aux)
        return res.status(400).json({ error: "Registro duplicado" });

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).json({ error: "Usuário inválido" });
      }

      const list = await List.create({
        id,
        name,
        user_id,
      });

      if (books) {
        books.forEach(async (b) => {
          await list.addBook(b).catch((err) => {
            console.log(err);
          });
        });
      }

      return res.json(list);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async pushBook(req, res) {
    try {
      // const { book_id } = req.body;
      const { book_id, list_id } = req.params;

      const book = await Book.findByPk(book_id);

      if (!book) {
        return res.status(400).json({ error: "Livro inválido" });
      }

      const list = await List.findByPk(id);

      if (!list) {
        return res.status(400).json({ error: "Lista inválida" });
      }

      await list.addBook(book).catch((err) => {
        console.log(err);
      });

      return res.json(list);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getBooks(req, res) {
    try {
      const { id } = req.params;

      const list = await List.findByPk(id);

      if (!list) {
        return res.status(400).json({ error: "Lista inválida" });
      }

      let result = [];

      const annotations = await Annotation.findAll({
        attributes: [
          "id",
          "pages_read",
          "progress",
          "rating",
          "review",
          "date_start",
          "date_end",
          "favorite",
          "book_id"
        ],
        where: {
          user_id: list.user_id,
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
      });
      
      if (annotations.length > 0) {
        for (let annotation of annotations) {

          const book = await Book.findByPk( annotation.book_id,{
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
                through: {
                  attributes: [],
                },
              },
              {
                model: List,
                attributes: ["id", "name"],
                where: {id: id},
                through: {
                  attributes: [],
                },
              },
            ],
          });

          if(book)
            result.push({book: book, annotation: annotation})
        }
      }

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const list = await List.findByPk(id).catch((err) => {
        return res.status(400).json({ error: "Registro não existe" });
      });

      await list.destroy({ where: { id } });

      return res.json({ msg: "Cadastro excluído" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
