const { Op } = require("sequelize");
const Annotation = require("../models/Annotation");
const Book = require("../models/Book");
const Theme = require("../models/Theme");

var s = new Date().getFullYear();

const THIS_YEAR = s + "-01-01";

module.exports = {
  async getMonth(req, res) {
    try {
      const { user_id } = req.params;
      let result = [];

      if(user_id.length != 36 ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      let AnnotationByAllMonth = await Annotation.findAll({
        where: {
          [Op.and]: [
            Annotation.sequelize.where(
              Annotation.sequelize.fn(
                "date_trunc",
                "year",
                Annotation.sequelize.col("date_end")
              ),
              "=",
              THIS_YEAR
            ),
            { user_id: user_id },
          ],
        },
        attributes: [
          [
            Annotation.sequelize.fn(
              "date_trunc",
              "month",
              Annotation.sequelize.col("date_end")
            ),
            "month",
          ],
          [Annotation.sequelize.fn("count", "*"), "count"],
        ],
        group: ["month"],
      });

      for (let a of AnnotationByAllMonth) {
        result.push({
          month: a.dataValues["month"].getMonth() + 2,
          count: +a.dataValues["count"],
        });
      }

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  // async getMonth(req, res) {
  //   try {
  //     const { user_id } = req.params;

  //     let AnnotationByAllMonth = await Annotation.findAll({
  //       // where:{ [Op.and]: [Annotation.sequelize.where(Annotation.sequelize.fn('date_trunc',"year", Annotation.sequelize.col('date_end')), '=', THIS_YEAR), {user_id: user_id}]},
  //       attributes: [
  //         [
  //           // Annotation.sequelize.fn(
  //           //   "date_trunc",
  //           //   "month",
  //           //   Annotation.sequelize.col("date_end")
  //           // ),
  //           // "month",
  //           Annotation.sequelize.literal(`(
  //             EXTRACT(MONTH FROM TIMESTAMP 'Annotation'.'date_end') AS month
  //         )`)
  //         ],
  //         [Annotation.sequelize.fn("count", "*"), "count"],
  //       ],
  //       group: ["month"],
  //     });
  //     return res.json(AnnotationByAllMonth);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(400).json({ error: "Cadastro incorreto" });
  //   }
  // },

  async getYear(req, res) {
    try {
      const { user_id } = req.params;

      if(user_id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      let AnnotationByAllYear = await Annotation.findAll({
        where: { user_id: user_id },
        attributes: [
          [
            Annotation.sequelize.fn(
              "date_trunc",
              "year",
              Annotation.sequelize.col("date_end")
            ),
            "year",
          ],
          [Annotation.sequelize.fn("count", "*"), "count"],
        ],
        group: ["year"],
      });

      return res.json(AnnotationByAllYear);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getRating(req, res) {
    try {
      const rating = req.query.r;
      const user_id = req.query.u;

      if(user_id.length != 36 ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      let AnnotationByAllYear = await Annotation.findAll({
        where: { user_id: user_id },
        attributes: [
          "rating",
          [Annotation.sequelize.fn("count", "*"), "count"],
        ],
        group: ["Annotation.rating"],
        order: [['rating', 'DESC']]
      });
      return res.json(AnnotationByAllYear);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getTheme(req, res) {
    try {
      const user_id = req.query.user_id;

      const themes = await Theme.findAll({
        attributes: [
          [Theme.sequelize.col("name"), "name"],
          [Theme.sequelize.fn("count", "*"), "count"],
        ],
        include: [
          {
            model: Book,
            attributes: [],
            through: {
              attributes: [],
            },
          },
        ],
        group: ["Theme.id"],
      });

      return res.json(themes);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getFavorites(req, res) {
    try {
      const user_id = req.query.u;

      if(user_id.length != 36 ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      let AnnotationByFavorite = await Annotation.findAll({
        where: { user_id: user_id, favorite: 1 },
        attributes: [
          "favorite",
          [Annotation.sequelize.fn("count", "*"), "count"],
        ],
        group: ["Annotation.favorite"],
      });
      return res.json(AnnotationByFavorite);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },
};
