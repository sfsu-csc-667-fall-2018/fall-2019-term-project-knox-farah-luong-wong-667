'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn(
    'UserGames',
    'playerScore',
    {
      type: Sequelize.INTEGER
    });
  },

  down: (queryInterface, Sequelize) => {
    
   return queryInterface.removeColumn(
     'UserGames',
     'playerScore'
   )
  }
};
