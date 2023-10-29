const { Model, DataTypes } = require('sequelize');

class Annotation extends Model {
  static init(sequelize) {
    super.init(
      {
        pages_read: DataTypes.INTEGER,
        progress: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
        review: DataTypes.TEXT,
        date_start: DataTypes.DATE,
        date_end: DataTypes.DATE,
        favorite: DataTypes.INTEGER,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id'});
    this.belongsTo(models.Book, { foreignKey: 'book_id'});
    this.belongsToMany(models.Tag, { foreignKey: 'annotation_id', through: 'annotation_tag', as:'tags' });
  }
}

module.exports = Annotation;