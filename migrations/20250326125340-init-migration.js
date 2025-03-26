'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * 
     * 
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`CREATE DATABASE IF NOT EXISTS \`school-diary\` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;`)
    await queryInterface.sequelize.query(`
    CREATE TABLE \`USERS\` (
      \`user_id\` int NOT NULL AUTO_INCREMENT,
      \`first_name\` varchar(45) NOT NULL,
      \`last_name\` varchar(45) NOT NULL,
      \`email\` varchar(45) NOT NULL,
      \`password\` varchar(45) NOT NULL,
      \`role\` enum('admin','teacher','student') NOT NULL,
      \`banned\` tinyint DEFAULT NULL,
      \`graduated\` tinyint DEFAULT NULL,
      \`fired\` tinyint DEFAULT NULL,
      \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NOT NULL,
      PRIMARY KEY (\`user_id\`),
      UNIQUE KEY \`user_id_UNIQUE\` (\`user_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;  `)
    await queryInterface.sequelize.query(`CREATE TABLE \`CLASSES\` (
    \`class_id\` int NOT NULL AUTO_INCREMENT,
    \`teacher_id\` int NOT NULL,
    \`title\` varchar(45) NOT NULL,
    \`year\` int NOT NULL,
    \`status\` enum('draft','active','closed') NOT NULL,
    \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` timestamp NOT NULL,
    PRIMARY KEY (\`class_id\`),
    UNIQUE KEY \`class_id_UNIQUE\` (\`class_id\`),
    KEY \`teacher_id_idx\` (\`teacher_id\`),
    CONSTRAINT \`teacher_id\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`USERS\` (\`user_id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;  `)
    await queryInterface.sequelize.query(`CREATE TABLE \`SUBJECTS\` (
    \`subject_id\` int NOT NULL AUTO_INCREMENT,
    \`name\` varchar(45) DEFAULT NULL,
    \`description\` varchar(45) DEFAULT NULL,
    PRIMARY KEY (\`subject_id\`),
    UNIQUE KEY \`subject_id_UNIQUE\` (\`subject_id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;  `)
    await queryInterface.sequelize.query(`CREATE TABLE \`USER_CLASSES\` (
    \`user_class_id\` int NOT NULL AUTO_INCREMENT,
    \`class_id\` int NOT NULL,
    \`student_id\` int NOT NULL,
    \`teacher_id\` int NOT NULL,
    \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` timestamp NOT NULL,
    PRIMARY KEY (\`user_class_id\`),
    UNIQUE KEY \`user_class_id_UNIQUE\` (\`user_class_id\`),
    KEY \`class_id_idx\` (\`class_id\`),
    KEY \`user_id_idx\` (\`teacher_id\`),
    KEY \`student_id_idx\` (\`student_id\`),
    CONSTRAINT \`class_id\` FOREIGN KEY (\`class_id\`) REFERENCES \`CLASSES\` (\`class_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT \`student_fk\` FOREIGN KEY (\`student_id\`) REFERENCES \`USERS\` (\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT \`teacher_fk\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`USERS\` (\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;`)
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
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`id_UNIQUE\` (\`id\`),
      KEY \`student_fk_idx\` (\`student_id\`),
      KEY \`subject_fk_idx\` (\`subject_id\`),
      KEY \`class_fk_idx\` (\`class_id\`),
      KEY \`teacher_fk_idx\` (\`teacher_id\`),
      CONSTRAINT \`class_fk\` FOREIGN KEY (\`class_id\`) REFERENCES \`CLASSES\` (\`class_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`journal_student_fk\` FOREIGN KEY (\`student_id\`) REFERENCES \`USERS\` (\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`journal_teacher_fk\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`USERS\` (\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`subject_fk\` FOREIGN KEY (\`subject_id\`) REFERENCES \`SUBJECTS\` (\`subject_id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`DROP TABLE \`school-diary\`.\`JOURNAL\``)
    await queryInterface.sequelize.query(`DROP TABLE \`school-diary\`.\`USER_CLASSES\``)
    await queryInterface.sequelize.query(`DROP TABLE \`school-diary\`.\`CLASSES\``)
    await queryInterface.sequelize.query(`DROP TABLE \`school-diary\`.\`SUBJECTS\``)
    await queryInterface.sequelize.query(`DROP TABLE \`school-diary\`.\`USERS\``)
  }
};
