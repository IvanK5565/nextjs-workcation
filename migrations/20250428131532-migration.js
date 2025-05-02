"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`ALTER TABLE users 
CHANGE COLUMN user_id id INT NOT NULL AUTO_INCREMENT ,
ADD COLUMN emailVerified TIMESTAMP NULL AFTER status ;`);
		await queryInterface.sequelize.query(`ALTER TABLE classes 
CHANGE COLUMN class_id id INT NOT NULL AUTO_INCREMENT ;`);
		await queryInterface.sequelize.query(`ALTER TABLE subjects 
CHANGE COLUMN subject_id id INT NOT NULL AUTO_INCREMENT ;`);
		await queryInterface.sequelize.query(`ALTER TABLE userClasses 
CHANGE COLUMN user_class_id id INT NOT NULL AUTO_INCREMENT ;`);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize
			.query(`ALTER TABLE users 
    CHANGE COLUMN id user_id INT NOT NULL AUTO_INCREMENT ,
    DROP COLUMN emailVerified ;`);
    await queryInterface.sequelize.query(`ALTER TABLE classes 
    CHANGE COLUMN id class_id INT NOT NULL AUTO_INCREMENT ;`);
        await queryInterface.sequelize.query(`ALTER TABLE subjects 
    CHANGE COLUMN id subject_id INT NOT NULL AUTO_INCREMENT ;`);
        await queryInterface.sequelize.query(`ALTER TABLE userClasses 
    CHANGE COLUMN id user_class_id INT NOT NULL AUTO_INCREMENT ;`);
	},
};
