const Permission = require("../models/Permission");
const crypto = require("crypto");

module.exports = {
  async getAll(req, res) {
    try {
      const perms = await Permission.findAll({
        attributes: ["id", "name", "url"],
      });

      return res.json(perms);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const perms = await Permission.findByPk(id,{
        attributes: ["id", "name", "url"],
      });

      return res.json(perms);
    } catch (error) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async create(req, res) {
    try {
      const { name, url } = req.body;

      const name_aux = await Permission.findOne({
        where: {
          name: name,
        },
      });

      if (name_aux)
        return res.status(400).json({ error: "Registro duplicado" });

      const id = crypto.randomUUID();
      const perm = await Permission.create({ id, name, url });

      return res.json(perm);
    } catch (error) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async update(req, res) {
    try {
      const { id, name, url } = req.body;

      if(id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const name_aux = await Permission.findOne({
        where: {
          name: name,
        },
      });
      
      if (name_aux && id != name_aux.id)
        return res.status(400).json({ error: "Registro duplicado" });


      const permis = await Permission.findByPk(id).catch((err) => {
        return res.status(400).json({ error: "Registro não encontrado" });
      });


      await permis.update({name, url});
      
      return res.json(permis);
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const permis = await Permission.findByPk(id).catch((err) => {
        return res.status(404).json({ error: "Registro não encontrado" });
      });

      await permis.destroy({ where: {id} });

      return res.json({ msg: "Cadastro excluído" });
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },
};
