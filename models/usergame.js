'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserGame = sequelize.define('UserGame', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    UserId: { 
      type: DataTypes.UUID
    },
    GameId: {
      type: DataTypes.UUID
    },
    playerScore: {
      type: DataTypes.INTEGER
    }
  }, {});
  UserGame.associate = function(models) {
  };
  return UserGame;
};