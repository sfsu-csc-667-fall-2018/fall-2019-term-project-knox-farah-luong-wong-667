const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const models = require("../../models/associations")
const Game = models["Game"];
const User = models["User"];
const UserGame = models["UserGame"];

router.get('/', (request, response, next) => {
  response.render('game', { title: 'Gamepage' });
});


// router.get('/join', (request, response, next) => {
//   Game.findAll({
//     where:{
//       id: request.body.gid,
//     }
//   })
//    .then((result)=>{
//       response.json(result)
//    })
// });


//create a game, requires user to be logged in
router.post('/create',(request, response, next) =>{
  Game.create()
  .then((newgame)=>UserGame.create({
    UserId: request.session.uid,
    GameId: newgame.id
  }))
  .then((result)=>{
    response.json(result)
  })
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
})


router.get('/gamelist',(request, response, next) =>{
  UserGame.findAll()
  .then((result)=>{
    response.json(result)
  })
});


router.post('/test/create',(request, response, next) =>{
  Game.create()
  .then((newgame)=>UserGame.create({
    UserId: request.body.uid,
    GameId: newgame.id
  }))
  .then((result)=>{
    response.json(result)
  })
});


router.get('/test/get/games', (request, response, next) => {
  Game.findAll({
    include: {
      model: User
    }
  })
  .then((results) => {
    response.json(results)
  })
  .catch((err) => {
    response.send(err)
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
    
  module.exports = router;
  