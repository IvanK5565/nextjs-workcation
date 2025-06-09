'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE TABLE schedule (
  id INT NOT NULL,
  classId INT NOT NULL,
  subjectId INT NOT NULL,
  dayOfWeek INT NOT NULL,
  time INT NOT NULL,
  PRIMARY KEY (id),
  INDEX class_idx (classId ASC) VISIBLE,
  INDEX subject_idx (subjectId ASC) VISIBLE,
  CONSTRAINT class
    FOREIGN KEY (classId)
    REFERENCES classes (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT subject
    FOREIGN KEY (subjectId)
    REFERENCES subjects (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);
`)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TABLE schedule`)
  }
};
