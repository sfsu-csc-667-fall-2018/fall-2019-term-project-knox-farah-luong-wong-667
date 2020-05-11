'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      xCoordinate: {
        type: Sequelize.INTEGER
      },
      yCoordinate: {
        type: Sequelize.INTEGER
      },
      letter: {
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      GameId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Games',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tiles');
  }
};