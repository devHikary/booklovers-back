'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('books', 
    'thumbnail', { 
      type: Sequelize.STRING,
        allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('books','thumbnail_url');
    await queryInterface.removeColumn('books','thumbnail');
  }
};
