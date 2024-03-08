const Annotation = require("../models/Annotation");
const crypto = require("crypto");
const User = require("../models/User");
const Book = require("../models/Book");
const Tag = require("../models/Tag");
const { Op } = require("sequelize");
const Author = require("../models/Author");
const Theme = require("../models/Theme");

const TODAY_START = new Date().setHours(0, 0, 0, 0);
const NOW = new Date();

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
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
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

      let arr_tag_id = [];
      if (tags) {
        for (const tag of tags) {
          const id = crypto.randomUUID();
          const [aObject, created] = await Tag.findOrCreate({
            where: { name: tag.name },
            defaults: {
              id: id,
              user_id: user_id,
            },
          });
          if (tag.id === null && created) tag.id = id;
          if (!created) tag.id = aObject.id;

          arr_tag_id.push(tag.id);
        }
        await annotation.setTags(arr_tag_id);
      }

      return res.json(annotation);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async update(req, res) {
    try {
      const {
        id,
        user_id,
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

      let arr_tag_id = [];
      if (tags) {
        for (const tag of tags) {
          const id = crypto.randomUUID();
          const [aObject, created] = await Tag.findOrCreate({
            where: { name: tag.name },
            defaults: {
              id: id,
              user_id: user_id,
            },
          });
          if (tag.id === null && created) tag.id = id;
          if (!created) tag.id = aObject.id;

          arr_tag_id.push(tag.id);
        }
        await annotation.setTags(arr_tag_id);
      }

      return res.json(annotation);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getFinished(req, res) {
    try {
      const { user_id } = req.params;
      const result = [];

      if(user_id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

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
          [Op.or]: [
            {
              date_end: {
                [Op.ne]: null,
              },
            },
            {
              progress: {
                [Op.eq]: 100,
              },
            },
          ],
          user_id: user_id,
        },
        include: [
          {
            association: "tags",
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
          // {
          //   model: Book,
          //   // attributes: ["id", "title"],
          //   // through: {
          //   //   attributes: [],
          //   // },
          // },
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
            ],
          });

          if(book)
            result.push({book: book, annotation: annotation})
        }
      }

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getFavorite(req, res) {
    try {
      const { user_id } = req.params;
      const result = [];

      if(user_id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

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
          favorite: {
            [Op.eq]: 1,
          },
          user_id: user_id,
        },
        include: [
          {
            association: "tags",
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
          // {
          //   model: Book,
          //   // attributes: ["id", "title"],
          //   // through: {
          //   //   attributes: [],
          //   // },
          // },
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
            ],
          });

          if(book)
            result.push({book: book, annotation: annotation})
        }
      }

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getReading(req, res) {
    try {
      const { user_id } = req.params;
      const result = [];

      if(user_id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

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
          [Op.or]: [
            {
              [Op.and]: [
                {
                  date_start: {
                    [Op.ne]: null,
                  },
                },
                {
                  date_end: {
                    [Op.eq]: null,
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  progress: {
                    [Op.ne]: 0,
                  },
                },
                {
                  progress: {
                    [Op.ne]: 100,
                  },
                },
                {
                  date_end: {
                    [Op.eq]: null,
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  pages_read: {
                    [Op.ne]: 0,
                  },
                },
                {
                  progress: {
                    [Op.ne]: 100,
                  },
                },
                {
                  date_end: {
                    [Op.eq]: null,
                  },
                },
              ],
            },
          ],
          user_id: user_id,
          date_end: {
            [Op.eq]: null,
          },
        },
        include: [
          {
            association: "tags",
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
          // {
          //   model: Book,
          //   // attributes: ["id", "title"],
          //   // through: {
          //   //   attributes: [],
          //   // },
          // },
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
            ],
          });

          if(book)
            result.push({book: book, annotation: annotation})
        }
      }

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getRating(req, res) {
    try {
      const rating = req.query.r;
      const user_id = req.query.u;

      const result = [];

      if(user_id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

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
         user_id: user_id,
         rating: rating
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
            ],
          });

          if(book)
            result.push({book: book, annotation: annotation})
        }
      }

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getAllByTheme(req, res) {
    try {
      const { id, user_id } = req.query;
      let result = [];

      if(user_id.length != 36 || id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const books = await Book.findAll({
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
            where: { id: id },
            through: {
              attributes: [],
            },
          },
        ],
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
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getAllByAuthor(req, res) {
    try {
      const { id, user_id } = req.query;
      let result = [];

      if(user_id.length != 36 || id.length != 36 ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

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
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },
};
