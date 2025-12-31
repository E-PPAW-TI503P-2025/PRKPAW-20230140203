'use strict';

/** @type {import('sequelize-cli').Migration} */
"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("SensorLogs", "motion", {
      type: Sequelize.BOOLEAN, // Tipe data True/False
      allowNull: true,
      defaultValue: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("SensorLogs", "motion");
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
