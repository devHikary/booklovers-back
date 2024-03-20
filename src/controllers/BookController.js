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

      if(user_id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

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
        if(annotation != null && annotation.date_end == null && annotation.date_start == null && annotation.favorite == 0 && annotation.pages_read == 0 && annotation.progress == 0 && annotation.rating == 0 && annotation.review == ""){
          await annotation.destroy({ where: {id: annotation.id} });
        }
        result.push({book: book, annotation: annotation})
      }

      return res.json(result);
    } catch (err) {
      if( err.name === 'SequelizeConnectionRefusedError'){
        res.status(503).json({ message: 'Erro no servidor! Tente mais tarde'});
      } else{
        res.status(500).json({ message: 'Erro no servidor! Tente mais tarde' });
      }
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
        return res.status(400).json({
          error: "Registro duplicado",
          book_id: b.id,
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
      return res.status(500).json({ message: 'Erro no servidor! Tente mais tarde' });
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

      const isbn_aux = await Book.findOne({
        where:{isbn_13: isbn_13}
      })

      if(isbn_aux && isbn_aux.id != id)
        return res.status(400).json({ error: "Registro duplicado", book_id: isbn_aux.id })

      const book = await Book.findByPk(id).catch(() => {
        return res.status(400).json({ error: "Cadastro não encontrado" })
      });



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
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

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
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
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
      return res.json({book, annotation});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getByTitle(req, res) {
    try {
      const title = req.query.t;
      const user_id = req.query.u;
      const result = [];

      const query = `%${title}%`;

      title.replace("%20", "%");
 
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
      console.log(err)
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

};
