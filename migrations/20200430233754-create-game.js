'use strict';
module.exports = {
 up: (queryInterface, Sequelize) => {
 return queryInterface.createTable(
 'Games',
 {
 gid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
 },
 hostUid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {model: 'Users', key: 'id'} 
 },
 guestUid: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {model: 'Users', key: 'id'}
 },
 createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
    allowNull: false
 }
 }
 );
 },
 down: (queryInterface, Sequelize) => {
 return queryInterface.dropTable('Games');
 }
};
