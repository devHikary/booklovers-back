const Annotation = require("../models/Annotation");
const crypto = require("crypto");
const User = require("../models/User");
const Book = require("../models/Book");
const List = require("../models/List");

module.exports = {
  async getAll(req, res) {
    try {
      const list = await List.findAll();

      return res.json(list);
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
          name: name,
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

      if (books.length > 0) {
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
      const { book_id } = req.body;
      const { id } = req.params;

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

      const books = await List.findAll({
        where: {
          id,
        },
        include: {
          model: Book, 
          attributes: ['id','title'], 
          through: { 
            attributes: []
          }
        }
      });

      return res.json(books);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
