const { Model, DataTypes } = require('sequelize');

class Goal extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      target: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      date_start: DataTypes.DATE,
      date_end: DataTypes.DATE,
      status: DataTypes.INTEGER,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id'});
  }
}

module.exports = Goal;