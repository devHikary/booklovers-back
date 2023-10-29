const Goal = require("../models/Goal");
const crypto = require("crypto");
const User = require("../models/User");

module.exports = {
  async getAll(req, res) {
    try {
      const goals = await Goal.findAll();

      return res.json(goals);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { user_id, name, target, amount, date_start, date_end, status } =
        req.body;
      const id = crypto.randomUUID();

      const name_aux = await Goal.findOne({
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

      const goal = await Goal.create({
        id,
        name,
        target,
        amount,
        date_start,
        date_end,
        status,
        user_id
      });

      return res.json(goal);

    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
