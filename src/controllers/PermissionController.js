const Permission = require('../models/Permission');
const crypto = require('crypto');

module.exports = {
  async getAll(req, res) {
    const perms = await Permission.findAll();

    return res.json(perms);
  },

  async create(req, res) {
    const { name, url } = req.body;

    const name_aux = await Permission.findOne({
      where: {
        name: name,
      },
    });

    if (name_aux)
      return res.status(400).json({ error: "Registro duplicado" });

    const id = crypto.randomUUID()
    const perm = await Permission.create({ id, name, url });

    return res.json(perm);
  }
};