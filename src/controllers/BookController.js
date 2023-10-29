const Book = require("../models/Book");
const { DataTypes, Op, where } = require("sequelize");
const crypto = require("crypto");
const Author = require("../models/Author");
const Theme = require("../models/Theme");
const Annotation = require("../models/Annotation");
const annotations = require("../models/Annotation");
const Tag = require("../models/Tag");

module.exports = {
  async getAll(req, res) {
    try {
      const{user_id} = req.params;
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

      for(let book of books){
        const annotation = await Annotation.findOne(
          {
            attributes: ["id","pages_read", "progress", "rating", "review", "date_start", "date_end", "favorite"],
            where: {
              [Op.and]: [{ book_id: book.id }, { user_id: user_id }],
            },
          },
          {
            include: [
              {
                model: Tag,
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
          }
        );
        result.push({book: book, annotation: annotation})
      }

      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const {
        title,
        subtitle,
        publisher,
        isbn_13,
        pages,
        release_dt,
        description,
        thumbnail,
        authors,
        themes,
      } = req.body;

      const id = crypto.randomUUID();

      const b = await Book.findOne({
        where: { isbn_13 },
      });

      if (b) {
        const b_id = b.id;
        return res.status(400).json({
          error: "Registro duplicado",
          book_id: b_id,
        });
      }

      const book = await Book.create({
        id,
        title,
        subtitle,
        publisher,
        isbn_13,
        pages,
        release_dt,
        description,
        thumbnail,
      });

      const arr_author_id = [];
      if (authors.length > 0) {
        for (const author of authors) {
          const id = crypto.randomUUID();
          const [aObject, created] = await Author.findOrCreate({
            where: { name: author.name },
            defaults: {
              id: id,
            },
          });
          if (author.id === null && created) author.id = id;
          if (!created) author.id = aObject.id;

          arr_author_id.push(author.id);
        }
        await book.setAuthors(arr_author_id);
      }

      const arr_theme_id = [];
      if (themes.length > 0) {
        for (const theme of themes) {
          const id = crypto.randomUUID();
          const [tObject, created] = await Theme.findOrCreate({
            where: { name: theme.name },
            defaults: {
              id: id,
            },
          });
          if (theme.id === null && created) theme.id = id;
          if (!created) theme.id = tObject.id;

          arr_theme_id.push(theme.id);
        }
        await book.setThemes(arr_theme_id);
      }

      return res.json(book);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async update(req, res) {
    try {
      const {
        id,
        title,
        subtitle,
        publisher,
        isbn_13,
        pages,
        release_dt,
        description,
        thumbnail,
        authors,
        themes,
      } = req.body;

      const book = await Book.findByPk(id);

      if (!book)
        return res.status(400).json({ error: "Cadastro não encontrado" });

      book.update({
        id,
        title,
        subtitle,
        publisher,
        isbn_13,
        pages,
        release_dt,
        description,
        thumbnail,
      });

      const arr_author_id = [];
      if (authors.length > 0) {
        for (const author of authors) {
          const id = crypto.randomUUID();
          const [aObject, created] = await Author.findOrCreate({
            where: { name: author.name },
            defaults: {
              id: id,
            },
          });
          if (author.id === null && created) author.id = id;
          if (!created) author.id = aObject.id;

          arr_author_id.push(author.id);
        }
        await book.setAuthors(arr_author_id);
      }

      const arr_theme_id = [];
      if (themes.length > 0) {
        for (const theme of themes) {
          const id = crypto.randomUUID();
          const [tObject, created] = await Theme.findOrCreate({
            where: { name: theme.name },
            defaults: {
              id: id,
            },
          });
          if (theme.id === null && created) theme.id = id;
          if (!created) theme.id = tObject.id;

          arr_theme_id.push(theme.id);
        }
        await book.setThemes(arr_theme_id);
      }

      return res.json(book);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id, {
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
        ],
      });

      return res.json(book);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getByIdUser(req, res) {
    try {
      const { id, user_id } = req.params;
      const book = await Book.findByPk(id, {
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
        ],
      });
      const annotation = await Annotation.findOne(
        {
          attributes: ["id","pages_read", "progress", "rating", "review", "date_start", "date_end", "favorite"],
          where: {
            [Op.and]: [{ book_id: book.id }, { user_id: user_id }],
          },
        },
        {
          include: [
            {
              model: Tag,
              attributes: ["id", "name"],
              through: {
                attributes: [],
              },
            },
          ],
        }
      );
        console.log("*****")
      return res.json({book, annotation});
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getByTitle(req, res) {
    try {
      const { title } = req.params;
      const query = `%${title}%`;

      title.replace("%20", "%");
      console.log(title);

      const books = await Book.findAll({
        where: { title: { [Op.like]: query } },
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
        ],
      });

      return res.json(books);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
