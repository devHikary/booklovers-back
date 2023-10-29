const { Model, DataTypes } = require('sequelize');

class Role extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsToMany(models.Permission, { foreignKey: 'role_id', through: 'role_permission' });
    this.hasMany(models.User, { foreignKey: 'role_id' });
  }
}

module.exports = Role;