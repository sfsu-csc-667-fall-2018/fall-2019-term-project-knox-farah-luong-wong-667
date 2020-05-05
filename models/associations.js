const Sequelize = require("sequelize");
const db = require("../db/index");
const GlobalMessageModel = require("./globalmessage");
const GlobalMessage = GlobalMessageModel(db, Sequelize);
const UserModel = require("./user");
const User = UserModel(db, Sequelize);
const GameModel = require("./game");
const Game = GameModel(db, Sequelize);

//Add Associations here
GlobalMessage.belongsTo(User);
User.hasMany(GlobalMessage);
User.hasMany(Game);
Game.belongsTo(User);
var container = [];
container['GlobalMessage'] = GlobalMessage
container['User'] = User
container['Game'] = Game

module.exports = container