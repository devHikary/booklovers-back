const { Model, DataTypes } = require('sequelize');

class Author extends Model {
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
    this.belongsToMany(models.Book, { foreignKey: 'author_id', through: 'author_book' });
  }
}

module.exports = Author;