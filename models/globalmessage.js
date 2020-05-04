'use strict';
module.exports = (sequelize, DataTypes) => {
  const GlobalMessage = sequelize.define('GlobalMessage', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    body: DataTypes.TEXT
  }, {});
  GlobalMessage.associate = function(models) {
    // associations can be defined here
    GlobalMessage.belongsTo(models.User);
  };
  return GlobalMessage;
};