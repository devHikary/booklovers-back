const Annotation = require("../models/Annotation");
const crypto = require("crypto");
const User = require("../models/User");
const Book = require("../models/Book");
const Tag = require("../models/Tag");
const Author = require("../models/Author");
const Theme = require("../models/Theme");
const { Op } = require("sequelize");

module.exports = {
  async getAll(req, res) {
    try {
      const tags = await Tag.findAll();

      return res.json(tags);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getAllUser(req, res) {
    try {
      const { user_id } = req.params;

      const tags = await Tag.findAll({
        where: { user_id: user_id },
      });

      return res.json(tags);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { name, user_id } = req.body;

      const id = crypto.randomUUID();

      const name_aux = await Tag.findOne({
        where: {
          name: name,
        },
      });

      if (name_aux)
        return res.status(400).json({ error: "Registro duplicado" });

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).json({ error: "Usuário inválido" });
      }

      const tag = await Tag.create({
        id,
        name,
        user_id,
      });

      return res.json(tag);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getById(req, res) {
    try {
      const { id, user_id } = req.params;
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
          user_id: user_id,
        },
        include: [
          {
            association: 'tags',
            where: {
              id: id,
            },
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
        ],
      });
      console.log("annot 888888888 ",annotations)
      
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
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async update(req, res) {
    try {
      const { id, name, user_id } = req.body;

      const name_aux = await Tag.findOne({
        where: {
          [Op.and]: [{name: name},{ user_id: user_id}]
          ,
        },
      });
      
      if (name_aux && id != name_aux.id)
        return res.status(400).json({ error: "Registro duplicado" });

      const tag = await Tag.findByPk(id).catch((err) => {
        return res.status(400).json({ error: "Usuário não existe" });
      });

      await tag.update({ id, name });

      return res.json(tag);
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;


      const tag = await Tag.findByPk(id).catch((err) => {
        return res.status(400).json({ error: "Registro não existe" });
      });

      await tag.destroy({ where: {id} });

      return res.json({ msg: "Cadastro excluído" });
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
