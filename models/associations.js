const Sequelize = require("sequelize");
const db = require("../db/index");
const GlobalMessageModel = require("./globalmessage");
const GlobalMessage = GlobalMessageModel(db, Sequelize);
const UserModel = require("./user");
const User = UserModel(db, Sequelize);
const GameModel = require("./game");
const Game = GameModel(db, Sequelize);
const UserGameModel = require("./usergame");
const UserGame = UserGameModel(db, Sequelize);

//Add Associations here
GlobalMessage.belongsTo(User);
User.hasMany(GlobalMessage);

User.belongsToMany(Game, {through: 'UserGame'});
Game.belongsToMany(User, {through: 'UserGame'});

var container = [];
container['GlobalMessage'] = GlobalMessage
container['User'] = User
container['Game'] = Game
container['UserGame'] = UserGame

module.exports = container