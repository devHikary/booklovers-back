const Goal = require("../models/Goal");
const crypto = require("crypto");
const User = require("../models/User");
const Annotation = require("../models/Annotation");
const { Op } = require("sequelize");
const Book = require("../models/Book");

const TODAY_START = new Date().setHours(0, 0, 0, 0);

const statusGoal = {
  EM_ANDAMENTO: 0,
  N_INICIADO: 1,
  CONCLUÍDO: 2,
  EXPIRADO: 3,
};

module.exports = {
  async getAll(req, res) {
    try {
      const { user_id } = req.params;

      if(user_id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const goals = await Goal.findAll({
        where: { user_id: user_id },
        order: [["status", "ASC"]],
      });

      if (goals.length > 0) {
        for (let goal of goals) {
          const book = await Annotation.findAll({
            where: [
              { user_id: user_id },
              {
                date_end: {
                  [Op.and]: [
                    { [Op.gte]: goal.date_start },
                    { [Op.lte]: goal.date_end },
                  ],
                },
              },
            ],
          });

          if (goal.status == statusGoal.EXPIRADO) {
            goal.status = statusGoal.EXPIRADO;
          }else if (goal.status == statusGoal.CONCLUÍDO) {
            goal.status = statusGoal.CONCLUÍDO;
          } else if (
            TODAY_START >= goal.date_start &&
            TODAY_START <= goal.date_end &&
            goal.amount >= goal.target
          ) {
            goal.status = statusGoal.CONCLUÍDO;
          } else if (
            TODAY_START >= goal.date_start &&
            TODAY_START <= goal.date_end
          ) {
            goal.status = statusGoal.EM_ANDAMENTO;
          } else if (TODAY_START < goal.date_start) {
            goal.status = statusGoal.N_INICIADO;
          } else {
            goal.status = statusGoal.EXPIRADO;
          }


          if(!(goal.status == statusGoal.CONCLUÍDO || goal.status == statusGoal.EXPIRADO)){
            await goal.update({ amount: book.length, status: goal.status });

          }

        }
      }

      return res.json(goals);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Erro no servidor! Tente mais tarde" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const goal = await Goal.findByPk(id,{ attributes: ["id", "name", "target", "amount", "date_start", "date_end", "status", "user_id"]});

      return res.json(goal);
    } catch (err) {
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getAndamento(req, res) {
    try {
      const { user_id } = req.params;
      const books = [];

      if(user_id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const goals = await Goal.findAll({
        where: {
          [Op.and]: [{ user_id: user_id }, { status: statusGoal.EM_ANDAMENTO }],
        },
      });
      if (goals.length > 0) {
        for (let goal of goals) {
          const book = await Annotation.findAll({
            attributes: ["id"],
            where: [
              { user_id: user_id },
              {
                date_end: {
                  [Op.and]: [
                    { [Op.gte]: goal.date_start },
                    { [Op.lte]: goal.date_end },
                  ],
                },
              },
            ],
            include: {
              model: Book,
              attributes: ["thumbnail"],
              // through: {
              //   attributes: [],
              // },
            },
          });
          books.push(book);

          
          if (goal.status == statusGoal.EXPIRADO) {
            goal.status = statusGoal.EXPIRADO;
          }else if (goal.status == statusGoal.CONCLUÍDO) {
            goal.status = statusGoal.CONCLUÍDO;
          } else if (
            TODAY_START >= goal.date_start &&
            TODAY_START <= goal.date_end &&
            goal.amount >= goal.target
          ) {
            goal.status = statusGoal.CONCLUÍDO;
          } else if (
            TODAY_START >= goal.date_start &&
            TODAY_START <= goal.date_end
          ) {
            goal.status = statusGoal.EM_ANDAMENTO;
          } else if (TODAY_START < goal.date_start) {
            goal.status = statusGoal.N_INICIADO;
          } else {
            goal.status = statusGoal.EXPIRADO;
          }

          if(!(goal.status == statusGoal.CONCLUÍDO || goal.status == statusGoal.EXPIRADO)){
            await goal.update({ amount: book.length, status: goal.status });

          }
        }
      }

      return res.json({ goals, books });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Erro no servidor! Tente mais tarde" });
    }
  },

  async deleteById(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const goal = await Goal.findByPk(id).catch((err) => {
        return res.status(404).json({ error: "Registro não encontrado" });
      });

      if(goal == null ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      await goal.destroy();

      return res.json({ msg: "Registro excluído" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Erro no servidor! Tente mais tarde" });
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
          user_id,
        },
      });

      if (name_aux)
        return res.status(400).json({ error: "Registro duplicado" });

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const goal = await Goal.create({
        id,
        name,
        target,
        amount,
        date_start,
        date_end,
        status,
        user_id,
      });

      return res.json(goal);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Erro no servidor! Tente mais tarde" });
    }
  },

  async update(req, res) {
    try {
      const {
        id,
        user_id,
        name,
        target,
        amount,
        date_start,
        date_end,
        status,
      } = req.body;

      if (id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const name_aux = await Goal.findOne({
        where: {
          name: name,
          user_id: user_id,
        },
      });

      if (name_aux && name_aux.id != id)
        return res.status(400).json({ error: "Registro duplicado" });

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const goal = await Goal.findByPk(id).catch((err) => {
        return res.status(404).json({ error: "Registro não encontrado" });
      });

      await goal.update({
        name,
        target,
        amount,
        date_start,
        date_end,
        status,
      });

      return res.json(goal);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Erro no servidor! Tente mais tarde" });
    }
  },
};

async function updateAmount(goals, user_id) {
  for (let goal of goals) {
    const book = await Annotation.findAll({
      where: [
        { user_id: user_id },
        {
          date_end: {
            [Op.and]: [
              { [Op.gte]: goal.date_start },
              { [Op.lte]: goal.date_end },
            ],
          },
        },
      ],
    });

    if (goal.status == statusGoal.CONCLUÍDO) {
      goal.status = statusGoal.CONCLUÍDO;
    } else if (
      TODAY_START >= goal.date_start &&
      TODAY_START <= goal.date_end &&
      goal.amount >= goal.target
    ) {
      goal.status = statusGoal.CONCLUÍDO;
    } else if (TODAY_START >= goal.date_start && TODAY_START <= goal.date_end) {
      goal.status = statusGoal.EM_ANDAMENTO;
    } else if (TODAY_START < goal.date_start) {
      goal.status = statusGoal.N_INICIADO;
    } else {
      goal.status = statusGoal.EXPIRADO;
    }

    goal.amount = book.length;
    await goal.update({ amount: book.length, status: goal.status });
  }

  return goals;
}
