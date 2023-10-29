'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 
    'role_id', { 
      type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    });
    await queryInterface.dropTable('user_role');
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'role_id', { /* query options */ });
  }
};
