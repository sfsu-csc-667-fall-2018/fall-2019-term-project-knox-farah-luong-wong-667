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
//Body: 'gid': game id
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
//Body: 'gid': game id, 'uid': user id
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

//Fills the player hand with unassigned tiles if they have less than 7 tiles
//Body: N/A
//Requires login
router.get('/fillPlayerHand', (request, response, next) => {
  Tile.findAll({
    where: {
      GameId: request.session.gid,
      UserId: request.session.uid,
      xCoordinate: null,
      yCoordinate: null
    }
  })
  .then((handResult) => {
    if (handResult.length < 7) {
      var promises = []
      var count = 7 - handResult.length
      while(count > 0) {
        var newPromise = Tile.findOne({
          order: [
            [Sequelize.fn('RANDOM')]
          ],
          limit: 1,
          where: {
            GameId: request.session.gid,
            UserId: null
          },
          include: [Game, User]
        }).then((tileResult) => {
          tileResult.update({
            UserId: request.session.uid
          })
        })
        promises.push(newPromise)
        count = count - 1
      }
      Promise.all(promises)
      .then(_ => {
        response.redirect("/games")
      })
    } else {
      response.redirect("/games")
    }
  })
})

//Gets all the tiles in a given game that are assigned to a given player that haven't been placed yet
//Body: 'gid': game id, 'uid': user id
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

//Gets all the placed tiles associated with the given game
//Body: 'gid': game id
router.get('/getBoardTiles', (request, response, next) => {
  Tile.findAll({
    where: {
      GameId: request.body.gid,
      [Sequelize.Op.not]: [
        {xCoordinate: null}
      ]
    }
  })
  .then((result) => {
    console.log(result)
    response.json(result)
  })
})

//Places a tile with the given tile id on the game board for its game with the provided x and y coordinates
//Body: 'tid': tile id, 'x': x coordinate of game board, 'y': y coordinate of game board
router.post('/placeTile', (request, response, next) => {
  Tile.findOne({
    where: {
      id: request.body.id
    }
  })
  .then((tileResult) => {
    tileResult.update({
      xCoordinate: request.body.xCoordinate,
      yCoordinate: request.body.yCoordinate
    }).then((result) => {
      console.log("Placed Tile:")
      console.log(result)
      response.json(result)
    })
  })
})

//Sets null scores to 0 in db, meant for admin purposes, will be deprecated once default values are set in schema
//Body: N/A
router.post('/updateNullScores', (request, response, next) => {
  UserGame.update({
    playerScore: 0
  },
  {
    where: {
      playerScore: null
    }
  }).then((results) => {
    console.log(results)
    response.json(results)
  })
})

//Adds the given score to the player score
//Body: 'gid': game id, 'uid': user id, 'score': the calculated score of the move
router.post('/addToPlayerScore', (request, response, next) => {
  UserGame.findOne({
    where: {
      UserId: request.session.uid,
      GameId: request.session.gid
    }
  }).then((userGameResult) => {
    userGameResult.update({
      playerScore: request.body.playerScore
    }).then((result) => {
      console.log("Player Score:")
      console.log(result)
      response.json(result)
    })
  })
})

//Returns all tiles in the db - this table will get VERY big so be cautious with its use
//Likely to produce performance issues
//Body: N/A
router.get('/getTiles', (request, response, next) => {
  Tile.findAll()
  .then((results) => {
    response.json(results)
  })
})

//Updates the active player in the game with the given id to the user with the given id
//Body: 'gid': game id, 'uid': user id
router.post('/updateActivePlayer', (request, response, next) => {
  Game.findOne({
    where: {
      id: request.body.gid
    }
  }).then((gameResult) => {
    gameResult.update({
      UserId: request.body.uid
    })
  }).then((results) => {
    console.log(results)
    response.json(results)
  })
})

//Create a game, requires a user to be logged in
//Body: N/A
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
    UserId: request.session.uid
  })
  .then((newgame) => {
    request.session.gid = newgame.id
    UserGame.create({
      UserId: newgame.UserId,
      GameId: newgame.id,
      playerScore: 0
    }).then((usergame) => {
      console.log("UserGame:")
      console.log(usergame)
      var promises = []
      for (var key in pieceBag) {
        for(let i = 0; i < pieceBag[key]; i++) {
          var newPromise = Tile.create({'letter':key, 'GameId':usergame.GameId});
          promises.push(newPromise);
        }
      }
      Promise.all(promises)
      .then((results) => {
        response.redirect('/api/game/fillPlayerHand')
      })
    })
  })
});

router.post("/submitTurn", (request, response, next) => {
  console.log("Request received!")
  console.log(request.session.uid)
  console.log(request.session.gid)
  console.log(request.body.playerScore)
  response.send("Okay!")
})

router.post('/submitTiles', (request, response, next) => {
  console.log("Submitting tiles")
  console.log(request.body.xCoordinate)
  console.log(request.body.yCoordinate)
  console.log(request.body.id)
})

router.post("/nextPlayer", (request, response, next) => {
  UserGame.findOne({
    where: {
      GameId: request.session.gid,
      [Sequelize.Op.not]: [
        {UserId: request.session.uid}
      ]
    }
  }).then((userGameResult) => {
    Game.update({
      UserId: userGameResult.UserId
    },{
      where: {
        id: request.session.gid
      }
    }).then((results) => {
      console.log("Next Player:")
      console.log(results)
      response.json(results)
    })
  })
})

//Creates a new UserGame entry for the user, adding them to the available game
//Fails if the user is already part of the game
//Body: 'gid': game id
router.post('/join', (request, response, next) => {
  console.log('Body GID:')
  console.log(request.body.gid)
  UserGame.findAll({
    where: {
      GameId: request.body.gid,
      UserId: request.session.uid
    }
  })
  .then((userGameResults) => {
    request.session.gid = request.body.gid
    if(userGameResults.length == 0) { //Additional configuring may need to happen here or when routed
      UserGame.create({
        GameId: request.body.gid,
        UserId: request.session.uid,
        playerScore: 0
      })
      .then((results) => {
        console.log(results)
        response.redirect("/games")
      })
    } else {
      request.session.gid = request.body.gid
      response.redirect("/games")
    }
  })
})
  
//Returns the logged in user's games
//Body: N/A
router.get('/myGames', (request, response, next) =>{
  UserGame.findAll({
    where: {
      UserId: request.session.uid,
    },
  })
  .then((userGameResults) => {
    var myGameIds = []
    userGameResults.forEach((object) => {
      myGameIds.push(object.GameId)
    })
    Game.findAll({
      where: {
        id: myGameIds
      }
    }).then((myGames) => {
      console.json(myGames)
    })
  })
  .catch((err) => {
    response.send(err)
  })
});

//Returns all games, with User info attached
//Body: N/A
router.get('/getGames',(request, response, next) =>{
  Game.findAll({
    include: User
  })
  .then((result)=>{
    response.json(result)
  });
});

//Returns all games that don't have all users
//Body: N/A
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

//Returns all UserGames (join table)
//Body: N/A
router.get('/getUserGames', (request, response, next) => {
  UserGame.findAll()
  .then((results) => {
    response.json(results)
  })
})

//Removes all Games from the Game table
//Be careful with this (obviously)
//Body: N/A
router.post('/clearGames',(request,response,next) => {
  Game.destroy({
    where: {}
  })
  .then(function () {})
  .then((result)=>{
    response.json(result)
  });
})

//Removes all UserGames from the UserGame table
router.post('/clearUserGames', (request, response, next) => {
  UserGame.destroy({
    where: {}
  })
  .then((results) => {
    response.json(results)
  })
})

//Removes all Tiles from the Tile table
router.post('/clearTiles', (request, response, next) => {
  Tile.destroy({
    where: {}
  })
  .then((results) => {
    response.json(results)
  })
})
  
//Removes UserGames with null GameId
//All UserGames should have a GameId, so this shouldn't break anything
//Body: N/A
router.post('/removeNull',(response, request, next) => {
  UserGame.destroy({
    where:{
      GameId: null,
    }
  })
});

module.exports = router;
  