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
         const subjects = [
            {
              name: "Mathematics",
              description: "Study of numbers, shapes, and mathematical logic."
            },
            {
              name: "Science",
              description: "Explores the natural world and scientific laws."
            },
            {
              name: "English Language and Literature",
              description: "Reading, writing, and analyzing literature."
            },
            {
              name: "History",
              description: "Study of past events, civilizations, and people."
            },
            {
              name: "Geography",
              description: "Study of Earth’s landscapes, environments."
            },
            {
              name: "Social Studies",
              description: "Study of society, politics, and human behavior."
            },
            {
              name: "Physical Education (PE)",
              description: "Promotes fitness, sports, and healthy living."
            },
            {
              name: "Art",
              description: "Creative expression through visual and performing arts."
            },
            {
              name: "Music",
              description: "Study of music theory, instruments, and performance."
            },
            {
              name: "Foreign Languages",
              description: "Learning to communicate in languages other than English."
            },
            {
              name: "Technology",
              description: "Study of tools, machines, and technological systems."
            },
            {
              name: "Health Education",
              description: "Focus on physical and mental health education."
            },
            {
              name: "Economics",
              description: "Study of resources, production, and financial systems."
            },
            {
              name: "Civics",
              description: "Study of government, laws, and citizenship."
            },
            {
              name: "Philosophy",
              description: "Exploration of fundamental questions and ideas."
            },
            {
              name: "Psychology",
              description: "Study of behavior, mind, and mental processes."
            },
            {
              name: "Business Studies",
              description: "Understanding business concepts and management."
            },
            {
              name: "Religious Studies",
              description: "Study of various religions and spiritual beliefs."
            },
            {
              name: "Environmental Science",
              description: "Study of the environment and human impact."
            },
            {
              name: "Drama and Theater",
              description: "Focus on acting, performance, and creative arts."
            }
          ];

        for (let i = 0; i < 20; i++) {
            const name = subjects[i].name;
            const description = subjects[i].description;
            await queryInterface.sequelize.query(`INSERT INTO \`school-diary\`.\`SUBJECTS\`
        (\`name\`, \`description\`)
        VALUES
        ('${name}', 
        '${description}'
        );
        `);
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.sequelize.query(`DELETE FROM \`school-diary\`.\`SUBJECTS\``);
        await queryInterface.sequelize.query('ALTER TABLE `SUBJECTS` AUTO_INCREMENT = 1;');
    }
};
