'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    hostUid: {
      type: DataTypes.UUID
    },
    guestUid: {
      type: DataTypes.UUID
    }
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
    Game.belongsTo(models.User);

  };
  return Game;
};