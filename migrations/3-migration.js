'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`CREATE TABLE \`CLASSES\` (
    \`class_id\` int NOT NULL AUTO_INCREMENT,
    \`teacher_id\` int NOT NULL,
    \`title\` varchar(100) NOT NULL,
    \`year\` int NOT NULL,
    \`status\` enum('draft','active','closed') NOT NULL,
    \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`class_id\`),
    UNIQUE KEY \`class_id_UNIQUE\` (\`class_id\`),
    KEY \`teacher_id_idx\` (\`teacher_id\`),
    CONSTRAINT \`teacher_id\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`USERS\` (\`user_id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;  `)
    },

  async down(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`DROP TABLE \`school-diary\`.\`CLASSES\``)
  }
};
