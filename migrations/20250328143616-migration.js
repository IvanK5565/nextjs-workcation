
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`
    ALTER TABLE \`school-diary\`.\`SUBJECTS\` 
    RENAME TO  \`school-diary\`.\`subjects\` ;`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`
    ALTER TABLE \`school-diary\`.\`subjects\` 
    RENAME TO  \`school-diary\`.\`SUBJECTS\` ;`)
  }
};
