const { Model, DataTypes } = require('sequelize');

class Permission extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      url: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsToMany(models.Role, { foreignKey: 'permission_id', through: 'role_permission'});
  }

}

module.exports = Permission;