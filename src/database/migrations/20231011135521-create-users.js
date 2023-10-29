'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', { 
      id: Sequelize.UUID
     });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
