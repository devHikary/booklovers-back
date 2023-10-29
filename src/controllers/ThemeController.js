const crypto = require("crypto");
const Book = require("../models/Book");
const Author = require("../models/Author");
const Theme = require("../models/Theme");

module.exports = {
  async getAll(req, res) {
    try {
      const theme = await Theme.findAll();

      return res.json(theme);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;

      const id = crypto.randomUUID();

      const name_aux = await Theme.findOne({
        where: {
          name: name,
        },
      });

      if (name_aux)
        return res.status(400).json({ error: "Registro duplicado" });

      const theme = await Theme.create({
        id,
        name
      });

      return res.json(theme);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
