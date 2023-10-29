const crypto = require("crypto");
const Author = require("../models/Author");

module.exports = {
  async getAll(req, res) {
    try {
      const author = await Author.findAll();

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
};
