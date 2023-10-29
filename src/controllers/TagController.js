const Annotation = require("../models/Annotation");
const crypto = require("crypto");
const User = require("../models/User");
const Book = require("../models/Book");
const Tag = require("../models/Tag");

module.exports = {
  async getAll(req, res) {
    try {
      const tag = await Tag.findAll();

      return res.json(tag);
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
        user_id
      });

      return res.json(tag);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
