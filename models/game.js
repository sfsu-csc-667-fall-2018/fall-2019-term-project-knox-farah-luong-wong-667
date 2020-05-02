'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    hostUid: DataTypes.INTEGER,
    guestUid: DataTypes.INTEGER
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};