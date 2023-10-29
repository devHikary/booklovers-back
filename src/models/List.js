const { Model, DataTypes } = require('sequelize');

class List extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id'});
    this.belongsToMany(models.Book, { foreignKey: 'list_id', through: 'list_book' });
  }
}

module.exports = List;