const Sequelize = require("sequelize")
const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const models = require("../../models/associations")
const Game = models["Game"];
const User = models["User"];
const UserGame = models["UserGame"];
const Tile = models["Tile"];

router.get('/', (request, response, next) => {
  response.render('game', { title: 'Gamepage' });
});

//Gets a random tile assigned to the given game that hasn't been assigned to a player yet
router.get('/getAvailableTile', (request, response, next) => {
  Tile.findOne({
    order: [
      [Sequelize.fn('RANDOM')] 
    ],
    limit: 1,
    where: {
      GameId: request.body.gid,
      UserId: null
    },
    include: [Game, User]
  })
  .then((tileResult) => {
    console.log(tileResult)
    response.json(tileResult)
  })
})

//Assigns a random tile assigned to the given game that hasn't been assigned to a player yet
router.post('/assignTile', (request, response, next) => {
  Tile.findOne({
    order: [
      [Sequelize.fn('RANDOM')] 
    ],
    limit: 1,
    where: {
      GameId: request.body.gid,
      UserId: null
    },
    include: [Game, User]
  })
  .then((tileResult) => {
    tileResult.update({
      UserId: request.body.uid
    }).then((result) => {
      console.log(result)
      response.json(result)
    })
  })
})

//Gets all the tiles in a given game that are assigned to a given player that haven't been placed yet
router.get('/getPlayerHand', (request, response, next) => {
  Tile.findAll({
    where: {
      GameId: request.body.gid,
      UserId: request.body.uid,
      xCoordinate: null,
      yCoordinate: null
    }
  })
  .then((result) => {
    console.log(result)
    response.json(result)
  })
})

router.get('/getTiles', (request, response, next) => {
  Tile.findAll()
  .then((results) => {
    response.json(results)
  })
})

//Create a game, requires a user to be logged in
router.post('/create', (request, response, next) => {
  var pieceBag = {
    'A': 9,
    'B': 2,
    'C': 2,
    'D': 4,
    'E': 12,
    'F': 2,
    'G': 3,
    'H': 2,
    'I': 9,
    'J': 1,
    'K': 1,
    'L': 4,
    'M': 2,
    'N': 6,
    'O': 8,
    'P': 2,
    'Q': 1,
    'R': 6,
    'S': 4,
    'T': 6,
    'U': 4,
    'V': 2,
    'W': 2,
    'X': 1,
    'Y': 2,
    'Z': 1,
    ' ': 2
  }
  Game.create({
    UserId: request.body.uid
  })
  .then((newgame) => {
    UserGame.create({
      UserId: newgame.UserId,
      GameId: newgame.id
    }).then((usergame) => {
      var promises = []
      for (var key in pieceBag) {
        for(let i = 0; i < pieceBag[key]; i++) {
          var newPromise = Tile.create({'letter':key, 'GameId':usergame.GameId});
          promises.push(newPromise);
        }
      }
      Promise.all(promises)
      .then((results) => {
        response.json(results)
      })
    })
  })
});

router.post('/join', (request, response, next) => {
  UserGame.findOrCreate({
    where:{
      GameId: request.body.gid,
      UserId: request.body.uid,
    }
  })
  .then((results)=>{
    console.log(results),
    response.json(results)
  })
  .catch((err) => response.json(err))
});
  
//returns  user's games
router.get('/mygames', (request, response, next) =>{
  UserGame.findAll({
    where: {
      UserId: request.session.uid,
    },
  })
  .then((results) => {
    response.json(results)
  })
  .catch((err) => {
    response.send(err)
  })
});

//returns all games, with user info.
router.get('/gamelist',(request, response, next) =>{
  Game.findAll({
    include: User
  })
  .then((result)=>{
    response.json(result)
  });
});

router.get('/availableGames', (request, response, next) => {
  UserGame.findAll({
    raw: true,
    group: ['GameId'],
    attributes: ['GameId', [Sequelize.fn('COUNT', 'GameId'), 'GameIdCount']],
  })
  .then((results) => {
    var availableGameIds = []
    results.forEach((object) => {
      if(object.GameIdCount < 2) {
        availableGameIds.push(object.GameId)
      }
    })
    Game.findAll({
      where: {
        id: availableGameIds
      }
    }).then((availableGames) => {
      response.json(availableGames)
    })
  })
})

router.get('/getUserGames', (request, response, next) => {
  UserGame.findAll()
  .then((results) => {
    response.json(results)
  })
})

//removes all the games from game table
router.post('/clearall',(request,response,next) => {
  Game.destroy({
    where: {}
  })
  .then(function () {})
  .then((result)=>{
    response.json(result)
  });
})
  
//removes games have null gameid
router.post('/removeNull',(response, request, next) => {
  UserGame.destroy({
    where:{
      GameId: null,
    }
  })
});

  module.exports = router;
  