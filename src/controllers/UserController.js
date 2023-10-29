const Role = require("../models/Role");
const User = require("../models/User");

const crypto = require("crypto");

module.exports = {
  async getAll(req, res) {
    try {
      const users = await User.findAll();

      return res.json(users);
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { username, role_id, name, email, password } = req.body;
      const id = crypto.randomUUID();

      const email_aux = await User.findOne({
        where: {
          email: email,
        },
      }).catch();
  
      if (email_aux)
        return res.status(400).json({ error: "E-mail já cadastrado" });

      const username_aux = await User.findOne({
        where: {
          username: username,
        },
      }).catch();
  
      if (username_aux)
        return res.status(400).json({ error: "Username já cadastrado" });

      const role = await Role.findByPk(role_id);

      if (!role) {
        return res.status(400).json({ error: "Perfil inválido" });
      }

      const user = await User.create({
        id,
        role_id,
        username,
        name,
        email,
        password,
      });

      return res.json(user);
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
