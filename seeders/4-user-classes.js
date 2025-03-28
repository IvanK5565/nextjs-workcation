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
      select user_id from users where status='active' and role='student';
    `);
    const [classes] = await queryInterface.sequelize.query(`
      select class_id, teacher_id from classes where status='active';
    `);
    const students_in_class_count = students.length / classes.length;

    for (let i = 0; i < classes.length; i++) {
      for (let j = 0; j < students_in_class_count; j++) {
        const class_id = classes[i].class_id;
        const student_id = students[j+i*students_in_class_count].user_id;
        const teacher_id = classes[i].teacher_id;
        await queryInterface.sequelize.query(`INSERT INTO user_classes
        (class_id, student_id, teacher_id)
        VALUES
        ('${class_id}', 
        '${student_id}', 
        '${teacher_id}'
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
    await queryInterface.sequelize.query(`DELETE FROM user_classes`);
    await queryInterface.sequelize.query('ALTER TABLE user_classes AUTO_INCREMENT = 1;');
  }
};
