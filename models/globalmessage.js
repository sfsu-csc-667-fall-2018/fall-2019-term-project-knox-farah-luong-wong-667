'use strict';

module.exports = (sequelize, DataTypes) => {
  const GlobalMessage = sequelize.define('GlobalMessage', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    body: DataTypes.TEXT,
    UserId: {
      type: DataTypes.UUID
    }
  }, {});

  GlobalMessage.associate = function(models) {
    GlobalMessage.belongsTo(models.User);
  };
  return GlobalMessage;
};