const { Model, DataTypes } = require('sequelize');

class Tag extends Model {
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
    this.belongsToMany(models.Annotation, { foreignKey: 'tag_id', through: 'annotation_tag' });
  }
}

module.exports = Tag;