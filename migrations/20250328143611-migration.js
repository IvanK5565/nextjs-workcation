'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`CREATE TABLE \`SUBJECTS\` (
    \`subject_id\` int NOT NULL AUTO_INCREMENT,
    \`name\` varchar(45) DEFAULT NULL,
    \`description\` varchar(100) DEFAULT NULL,
    \`createdAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedAt\` timestamp NULL DEFAULT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`subject_id\`),
    UNIQUE KEY \`subject_id_UNIQUE\` (\`subject_id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;  `)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`DROP TABLE \`SUBJECTS\``)
  }
};
