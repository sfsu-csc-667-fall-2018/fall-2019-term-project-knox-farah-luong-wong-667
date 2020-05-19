'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    UserId: {
      type: DataTypes.UUID
    },
    isWon: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  Game.associate = function(models) {
    Game.belongsToMany(model.User, {through: 'UserGame'});
  };
  return Game;
};