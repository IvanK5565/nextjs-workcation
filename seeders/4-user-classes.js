'use strict';

//import { faker } from "@faker-js/faker";
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
    * Example:
    * await queryInterface.bulkInsert('People', [{
    *   name: 'John Doe',
    *   isBetaMember: false
    * }], {});
    */
    const [students] = await queryInterface.sequelize.query(`
      select id from users where status='active' and role='student';
    `);
    const [classes] = await queryInterface.sequelize.query(`
      select id from classes where status='active';
    `);
    const students_in_class_count = students.length / classes.length;

    for (let i = 0; i < classes.length; i++) {
      for (let j = 0; j < students_in_class_count; j++) {
        const class_id = classes[i].id;
        const student_id = students[j+i*students_in_class_count].id;
        await queryInterface.sequelize.query(`INSERT INTO userClasses
        (class_id, student_id)
        VALUES
        (
        '${class_id}',
        '${student_id}'
        );
        `);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.sequelize.query(`DELETE FROM userClasses`);
    await queryInterface.sequelize.query('ALTER TABLE userClasses AUTO_INCREMENT = 1;');
  }
};
