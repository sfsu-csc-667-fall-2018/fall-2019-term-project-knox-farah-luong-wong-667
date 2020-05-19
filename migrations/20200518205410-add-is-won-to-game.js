'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn(
    'Games',
    'isWon',
    {
      type: Sequelize.BOOLEAN
    });
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn(
    'Games',
    'isWon',
  )
  }
};
