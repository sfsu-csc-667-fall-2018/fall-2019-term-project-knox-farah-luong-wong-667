'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: DataTypes.STRING
  }, {});

  User.associate = function(models) {
    User.hasMany(models.GlobalMessage);
    User.belongsToMany(models.Game, {through: 'UserGame'})

  };
  return User;
};