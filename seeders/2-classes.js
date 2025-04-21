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
     function rand(max) {
      return Math.floor(Math.random() * max);
    }
    const results = (await queryInterface.sequelize.query(`
        SELECT user_id FROM users
        WHERE role='teacher' AND status='active';
    `));
    const teachers = results[0];
    // console.log(teachers);
    await queryInterface.sequelize.query(`INSERT INTO classes
     (teacher_id, title, year, status)
     VALUES
     ('${teachers[12].user_id}', 
     '11', 
     '2013', 
     'closed'
     );
     `);

    for (let i = 0; i < 12; i++) {
      const teacher_id = teachers[rand(12)].user_id;
      const title = (i+1).toString();
      const year = 2025;
      const status = 'active';

      console.log('---- added class: ', i)


      const sql = `INSERT INTO classes
      (teacher_id, title, year, status)
      VALUES
      ('${teacher_id}', 
      '${title}', 
      '${year}', 
      '${status}'
      );
      `
      // console.log(sql);
      await queryInterface.sequelize.query(sql);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.sequelize.query(`DELETE FROM classes`);
    await queryInterface.sequelize.query('ALTER TABLE classes AUTO_INCREMENT = 1;');
  }
};
