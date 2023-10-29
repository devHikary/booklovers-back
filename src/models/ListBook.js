const { Model, DataTypes } = require('sequelize');

class ListBook extends Model {
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
    // this.belongsTo(models.List, { foreignKey: 'book_id'});
    // this.belongsTo(models.Book, { foreignKey: 'list_id'});
  }
}

module.exports = ListBook;