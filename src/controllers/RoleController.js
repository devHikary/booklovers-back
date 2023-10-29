const Permission = require("../models/Permission");
const Role = require("../models/Role");
const crypto = require("crypto");

module.exports = {
  async getAll(req, res) {
    const role = await Role.findAll();

    return res.json(role);
  },

  async create(req, res) {
    const { name, permissions } = req.body;

    const name_aux = await Role.findOne({
      where: {
        name: name,
      },
    });
    console.log("----- ", name_aux);

    if (name_aux)
      return res.status(400).json({ error: "Registro duplicado" });

    const selects = permissions.map((row) => selectAsync(row));

    Promise.all(selects)
      .then(async () => {
        const id = crypto.randomUUID();
        const role = await Role.create({ id, name });

        permissions.forEach(async (permission_id) => {
          const p = await Permission.findByPk(permission_id);

          const result = await p.addRole(role);
        });
        return res.json(role);
      })
      .catch(() => {
        return res.status(400).json({ error: "Permission not found" });
      });
  },
};

function selectAsync(cod) {
  return new Promise(async (res, rej) => {
    const p = await Permission.findByPk(cod);
    if (!p) rej("not found!");
    res("ok");
  });
}
