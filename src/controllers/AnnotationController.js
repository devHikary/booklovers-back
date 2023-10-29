const Annotation = require("../models/Annotation");
const crypto = require("crypto");
const User = require("../models/User");
const Book = require("../models/Book");
const Tag = require("../models/Tag");

module.exports = {
  async getAll(req, res) {
    try {
      const annotation = await Annotation.findAll({
        include: [
          {
            association: "tags",
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
          {
            model: Book,
            // attributes: ["id", "title"],
            // through: {
            //   attributes: [],
            // },
          },
        ],
      });

      return res.json(annotation);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const {
        user_id,
        book_id,
        pages_read,
        progress,
        rating,
        review,
        date_start,
        date_end,
        favorite,
        tags,
      } = req.body;

      const id = crypto.randomUUID();

      const book = await Book.findByPk(book_id);

      if (!book) {
        return res.status(400).json({ error: "Livro inválido" });
      }

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).json({ error: "Usuário inválido" });
      }

      const annotation = await Annotation.create({
        id,
        user_id,
        book_id,
        pages_read,
        progress,
        rating,
        review,
        date_start,
        date_end,
        favorite,
      });

      if (tags) {
        for (let tag of tags) {
          await annotation.addTag(tag);
        }
      }

      return res.json(annotation);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async update(req, res) {
    try {
      const {
        id,
        pages_read,
        progress,
        rating,
        review,
        date_start,
        date_end,
        favorite,
        tags,
      } = req.body;

      const annotation = await Annotation.findByPk(id);

      if (!annotation)
        return res.status(400).json({ error: "Cadastro não encontrado" });

      annotation.update({
        pages_read,
        progress,
        rating,
        review,
        date_start,
        date_end,
        favorite,
      });

      if (tags) {
        tags.forEach(async (t) => {
          if (t.selected) {
            await annotation.addTag(t.id);
          } else await annotation.removeTag(t.id);
        });
      }

      return res.json(annotation);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
