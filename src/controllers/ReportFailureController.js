const crypto = require("crypto");
const ReportFailure = require("../models/ReportFailure");

module.exports = {
  async getAll(req, res) {
    try {
      const report = await ReportFailure.findAll({
        order: [['status', 'ASC']],
        attributes: ['id','book_id','description', 'status', 'createdAt', 'updatedAt']
      });
  
      return res.json(report);
    } catch (err) {
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async create(req, res) {
    try {
      const { user_id, book_id, description, status } = req.body;

      const id = crypto.randomUUID();

      const report = await ReportFailure.create({
        id,
        user_id,
        book_id,
        description,
        status,
      }).catch(() => {
        return res.status(400).json({ error: "Cadastro incorreto" });
      });

      return res.json(report);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async update(req, res) {
    try {
      const { id, user_id, book_id, description, status } = req.body;

      const report = await ReportFailure.findByPk(id);

      await report
        .update({
          book_id,
          description,
          status,
        })
        .catch(() => {
          return res.status(400).json({ error: "Cadastro incorreto" });
        });

      return res.json(report);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const report = await ReportFailure.findByPk(id).catch(() => {
        return res.status(400).json({ error: "Cadastro incorreto" });
      });;

      return res.json(report);
    } catch (err) {
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },
};
