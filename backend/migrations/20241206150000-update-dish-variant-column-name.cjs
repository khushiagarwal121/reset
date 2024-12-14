"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('dish_variants', 'id_default', 'is_default');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('dish_variants', 'is_default', 'id_default');
  }
};