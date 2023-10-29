const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Role, { foreignKey: 'role_id'});
    this.hasMany(models.Goal, { foreignKey: 'user_id'});
    this.belongsToMany(models.Annotation, { foreignKey: 'user_id', through: 'annotations'});
    this.hasMany(models.Tag, { foreignKey: 'user_id'});
    this.hasMany(models.List, { foreignKey: 'user_id'});
  }
}

module.exports = User;