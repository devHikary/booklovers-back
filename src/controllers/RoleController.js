const Permission = require("../models/Permission");
const Role = require("../models/Role");
const crypto = require("crypto");

module.exports = {
  async getAll(req, res) {
    const role = await Role.findAll();

    return res.json(role);
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id, {
        attributes: ["id", "name"],
        include: [
          {
            model: Permission,
            attributes: ["id", "name", "url"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      return res.json(role);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { name, permissions } = req.body;

      const name_aux = await Role.findOne({
        where: {
          name: name,
        },
      });

      if (name_aux)
        return res.status(400).json({ error: "Registro duplicado" });

      var role = new Role();
      var p = new Permission();
      if (permissions.length > 0) {
        const id = crypto.randomUUID();
        role = await Role.create({ id, name });
        for (const perm of permissions) {
          p = await Permission.findByPk(perm).catch(() => {
            return res.status(400).json({ error: "Permission not found" });
          });
          const result = await p.addRole(role);
        }
      }

      return res.json(role);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
  async update(req, res) {
    try {
      const { id, name, permissions } = req.body;

      const name_aux = await Role.findOne({
        where: {
          name: name,
        },
      });

      if (name_aux && id != name_aux.id)
        return res.status(400).json({ error: "Registro duplicado" });

      const role = await Role.findByPk(id).catch((err) => {
        return res.status(400).json({ error: "Registro não existe" });
      });

      await role.update({ id, name });

      await role.setPermissions(permissions);

      return res.json(role);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id).catch((err) => {
        return res.status(400).json({ error: "Registro não existe" });
      });

      await role.destroy({ where: { id } });

      return res.json({ msg: "Cadastro excluído" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};
