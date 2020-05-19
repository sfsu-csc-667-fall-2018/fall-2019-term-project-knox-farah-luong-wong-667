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
const TileModel = require("./tile");
const Tile = TileModel(db, Sequelize);
const GameMessageModel = require("./gamemessage");
const GameMessage = GameMessageModel(db, Sequelize);

GlobalMessage.belongsTo(User);
User.hasMany(GlobalMessage);

GameMessage.belongsTo(User);
User.hasMany(GameMessage);
GameMessage.belongsTo(Game);
Game.hasMany(GameMessage);

Game.belongsTo(User);
User.hasMany(Game);

Tile.belongsTo(User);
User.hasMany(Tile);
Tile.belongsTo(Game);
Game.hasMany(Tile);

User.belongsToMany(Game, {through: 'UserGame'});
Game.belongsToMany(User, {through: 'UserGame'});

var container = [];
container['GlobalMessage'] = GlobalMessage
container['User'] = User
container['Game'] = Game
container['UserGame'] = UserGame
container['Tile'] = Tile
container['GameMessage'] = GameMessage

module.exports = container