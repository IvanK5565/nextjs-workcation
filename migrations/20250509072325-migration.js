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
    queryInterface.sequelize.query(`ALTER TABLE users 
    CHANGE COLUMN lastName lastName VARCHAR(45) NULL ,
    CHANGE COLUMN role role ENUM('admin', 'teacher', 'student', 'guest') NOT NULL DEFAULT 'guest' ;`)
     
  },
  
  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.sequelize.query(`ALTER TABLE users 
    CHANGE COLUMN lastName lastName VARCHAR(45) NOT NULL ,
    CHANGE COLUMN role role ENUM('admin', 'teacher', 'student') NOT NULL ;`)
  }
};
