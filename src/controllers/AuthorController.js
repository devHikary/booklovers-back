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
        attributes: ["id", "name"],
      });

      return res.json(author);
    } catch (err) {
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
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
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getByIdUser(req, res) {
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
        
        result.push({book: book, annotation: annotation})
      }


      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36 ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }
      
      const author = await Author.findByPk(id,{attributes: ["id", "name"]});

      return res.json(author);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async update(req, res) {
    try {
      const { id, name } = req.body;

      if(id.length != 36 ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const name_aux = await Author.findOne({
        where: {
          name: name,
        },
      });
      
      if (name_aux && id != name_aux.id)
        return res.status(400).json({ error: "Registro duplicado" });

      const author = await Author.findByPk(id).catch((err) => {
        return res.status(400).json({ error: "Registro não existe" });
      });

      await author.update({ id, name });
      
      return res.json(author);
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36 ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const author = await Author.findByPk(id).catch((err) => {
        return res.status(404).json({ error: "Registro não existe" });
      });

      if(author == null ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      await author.destroy({ where: {id} });

      return res.json({ msg: "Cadastro excluído" });
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },
};
