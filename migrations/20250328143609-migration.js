'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`
    CREATE TABLE USERS (
      \`user_id\` int NOT NULL AUTO_INCREMENT,
      \`first_name\` varchar(45) NOT NULL,
      \`last_name\` varchar(45) NOT NULL,
      \`email\` varchar(45) NOT NULL,
      \`password\` varchar(100) NOT NULL,
      \`role\` enum('admin','teacher','student') NOT NULL,
      \`status\` enum('active','banned','graduated','fired') DEFAULT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`user_id\`),
      UNIQUE KEY \`user_id_UNIQUE\` (\`user_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;  `)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`DROP TABLE USERS`)
  }
};
