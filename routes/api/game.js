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
  