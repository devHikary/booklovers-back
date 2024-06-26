const { Model, DataTypes } = require('sequelize');

class Book extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        subtitle: DataTypes.STRING,
        publisher: DataTypes.STRING,
        isbn_13: DataTypes.INTEGER,
        pages: DataTypes.INTEGER,
        release_dt: DataTypes.DATE,
        description: DataTypes.TEXT,
        thumbnail: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsToMany(models.Annotation, { foreignKey: 'book_id', through: 'annotations'});
    this.belongsToMany(models.List, { foreignKey: 'book_id', through: 'list_book' });
    this.belongsToMany(models.Author, { foreignKey: 'book_id', through: 'author_book' });
    this.belongsToMany(models.Theme, { foreignKey: 'book_id', through: 'theme_book' });
  }
}

module.exports = Book;