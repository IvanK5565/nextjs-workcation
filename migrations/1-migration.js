'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`CREATE SCHEMA IF NOT EXISTS \`school-diary\` DEFAULT CHARACTER SET utf8;`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await queryInterface.sequelize.query(`DROP DATABASE \`school-diary\``)
  }
};
