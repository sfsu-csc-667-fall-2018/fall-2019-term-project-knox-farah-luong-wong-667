'use strict';
module.exports = (sequelize, DataTypes) => {
  const GameMessage = sequelize.define('GameMessage', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    body: DataTypes.TEXT,
    UserId: {
      type: DataTypes.UUID
    },
    GameId: {
      type: DataTypes.UUID
    }
  }, {});

  GameMessage.associate = function(models) {
    // associations can be defined here
    GameMessage.belongsTo(models.User);
  };
  return GameMessage;
};