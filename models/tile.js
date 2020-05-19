'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tile = sequelize.define('Tile', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    xCoordinate: DataTypes.INTEGER,
    yCoordinate: DataTypes.INTEGER,
    letter: DataTypes.STRING,
    UserId: { 
      type: DataTypes.UUID
    },
    GameId: {
      type: DataTypes.UUID
    }
  }, {});
  Tile.associate = function(models) {
  };
  return Tile;
};