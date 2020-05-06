'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
    Game.belongsToMany(model.User, {through: 'UserGame'});
  };
  return Game;
};