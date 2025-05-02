'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`CREATE TABLE \`JOURNAL\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`student_id\` int NOT NULL,
      \`subject_id\` int NOT NULL,
      \`class_id\` int NOT NULL,
      \`teacher_id\` int NOT NULL,
      \`lecture_time\` datetime DEFAULT NULL,
      \`lecture_type\` enum('exam','lesson','homework') NOT NULL,
      \`lecture_status\` enum('missing','cancelled','sick','nothing') NOT NULL,
      \`mark_val\` int DEFAULT NULL,
      \`createdAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NULL DEFAULT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`id_UNIQUE\` (\`id\`),
      KEY \`student_fk_idx\` (\`student_id\`),
      KEY \`subject_fk_idx\` (\`subject_id\`),
      KEY \`class_fk_idx\` (\`class_id\`),
      KEY \`teacher_fk_idx\` (\`teacher_id\`),
      CONSTRAINT \`class_fk\` FOREIGN KEY (\`class_id\`) REFERENCES \`CLASSES\` (\`class_id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
      CONSTRAINT \`journal_student_fk\` FOREIGN KEY (\`student_id\`) REFERENCES USERS (\`user_id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
      CONSTRAINT \`journal_teacher_fk\` FOREIGN KEY (\`teacher_id\`) REFERENCES USERS (\`user_id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
      CONSTRAINT \`subject_fk\` FOREIGN KEY (\`subject_id\`) REFERENCES \`SUBJECTS\` (\`subject_id\`) ON DELETE CASCADE ON UPDATE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`DROP TABLE \`JOURNAL\``)
  }
};
