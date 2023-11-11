const { Model, DataTypes } = require('sequelize');

class ReportFailure extends Model {
  static init(sequelize) {
    super.init({
      book_id: DataTypes.UUID,
      description: DataTypes.TEXT,
      status: DataTypes.INTEGER,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id'});
  }
}

module.exports = ReportFailure;