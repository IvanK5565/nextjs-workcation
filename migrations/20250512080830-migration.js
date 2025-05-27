'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`ALTER TABLE users 
    ADD COLUMN authType ENUM('default', 'github', 'google') NULL DEFAULT 'default' AFTER status,
    CHANGE COLUMN password password VARCHAR(100) NULL ;`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`ALTER TABLE users 
    DROP COLUMN authType,
    CHANGE COLUMN password password VARCHAR(100) NOT NULL ;`)
  }
};
