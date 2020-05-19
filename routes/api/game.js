const Sequelize = require("sequelize")
const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const models = require("../../models/associations")
const Game = models["Game"];
const User = models["User"];
const UserGame = models["UserGame"];
const Tile = models["Tile"];
const GameMessage = models["GameMessage"];

router.get('/', (request, response, next) => {
  response.render('game', { title: 'Gamepage' });
});


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
    response.json(tileResult)
  })
})


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
      response.json(result)
    })
  })
})


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

router.get('/assignAllTiles', (request, response, next) => {
  Tile.findAll({
    where: {
      GameId: request.body.gid,
      UserId: null
    }
  }).then((gameResult) => {
    gameResult.forEach((tile) => {
      tile.update({
        UserId: request.body.UserId
      })
    }).then(_ => {
      Tile.findOne({
        where: {
          GameId: request.body.gid,
          UserId: null
        }
      }).then((result) => {
        response.send(result)
      })
    })
  })
})

router.post('/setIsWon', (request, response, next) => {
  Game.findAll()
  .then((games) => {
    games.forEach((game) => {
      Game.update({
        isWon: false
      }, {
        where: {}
      })
    }).then((results) => {
      response.json(results)
    })
  })
})


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
    response.json(result)
  })
})


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
    response.json(result)
  })
})


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
      response.json(result)
    })
  })
})


router.post('/updateNullScores', (request, response, next) => {
  UserGame.update({
    playerScore: 0
  },
  {
    where: {
      playerScore: null
    }
  }).then((results) => {
    response.json(results)
  })
})


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
      response.json(result)
    })
  })
})


router.get('/getTiles', (request, response, next) => {
  Tile.findAll()
  .then((results) => {
    response.json(results)
  })
})


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
    response.json(results)
  })
})


router.post('/createSmall', (request, response, next) => {
  var pieceBag = {
    'A': 2,
    'C': 2,
    'D': 2,
    'E': 2,
    'F': 2,
    'G': 2,
    'H': 2,
    'I': 2,
    'L': 2,
    'M': 2,
    'N': 2,
    'O': 2,
    'P': 2,
    'R': 2,
    'S': 2,
    'T': 2,
    'U': 2,
    'Y': 2
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
    'Z': 1
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


router.post('/getGameMessagesByGid', (request, response, next) => {
  GameMessage.findAll({
    where: {
      GameId: request.session.gid
    },
    include: [User, game]
  }).then((results) => {
    response.json(results)
  })
})


router.post("/createGameMessage/", (request, response, next) => {
  GameMessage.create({
      UserId: request.session.uid,
      GameId: request.session.gid,
      body: request.body.messageBody
    })
      .then((data) => {
        response.redirect('/games');
      })
      .catch((err) => {
        response.send("Error: ", err)
      })
})

router.get("/getGameMessages", function (request, response, next) {
  GameMessage.findAll({
    include: [User, Game]
  })
  .then((results) => {
    response.json(results)
  })
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
      response.json(results)
    })
  })
})


router.post('/join', (request, response, next) => {
  UserGame.findAll({
    where: {
      GameId: request.body.gid,
      UserId: request.session.uid
    }
  })
  .then((userGameResults) => {
    request.session.gid = request.body.gid
    if(userGameResults.length == 0) {
      UserGame.create({
        GameId: request.body.gid,
        UserId: request.session.uid,
        playerScore: 0
      })
      .then((results) => {
        response.redirect("/games")
      })
    } else {
      request.session.gid = request.body.gid
      response.redirect("/games")
    }
  })
})
  

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


router.get('/getGames',(request, response, next) =>{
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


router.post('/clearGameMessages', (request, response, next) => {
  GameMessage.destroy({
    where: {}
  })
  .then((result) => {
    response.json(result)
  })
})


router.post('/clearGames',(request,response,next) => {
  Game.destroy({
    where: {}
  })
  .then((result)=>{
    response.json(result)
  });
})


router.post('/clearUserGames', (request, response, next) => {
  UserGame.destroy({
    where: {}
  })
  .then((results) => {
    response.json(results)
  })
})


router.post('/clearTiles', (request, response, next) => {
  Tile.destroy({
    where: {}
  })
  .then((results) => {
    response.json(results)
  })
})
  

router.post('/removeNull',(response, request, next) => {
  UserGame.destroy({
    where:{
      GameId: null,
    }
  })
});

module.exports = router;
  