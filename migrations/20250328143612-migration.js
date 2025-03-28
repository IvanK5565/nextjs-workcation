'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`CREATE TABLE \`USER_CLASSES\` (
    \`user_class_id\` int NOT NULL AUTO_INCREMENT,
    \`class_id\` int NOT NULL,
    \`student_id\` int NOT NULL,
    \`teacher_id\` int NOT NULL,
    \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`user_class_id\`),
    UNIQUE KEY \`user_class_id_UNIQUE\` (\`user_class_id\`),
    KEY \`class_id_idx\` (\`class_id\`),
    KEY \`user_id_idx\` (\`teacher_id\`),
    KEY \`student_id_idx\` (\`student_id\`),
    CONSTRAINT \`class_id\` FOREIGN KEY (\`class_id\`) REFERENCES \`CLASSES\` (\`class_id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT \`student_fk\` FOREIGN KEY (\`student_id\`) REFERENCES \`USERS\` (\`user_id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT \`teacher_fk\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`USERS\` (\`user_id\`) ON DELETE CASCADE ON UPDATE RESTRICT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`DROP TABLE \`USER_CLASSES\``)
  }
};
