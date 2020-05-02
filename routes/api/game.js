const express = require('express');
const router = express.Router();
const db = require('../../db/index');

const GameModel = require("../../models/game");
const Sequelize = require("sequelize");
const Game = GameModel(db, Sequelize);

router.get('/', (request, response, next) => {
  response.render('game', { title: 'Gamepage' });
});
  

router.get('/createGame', (request,response,next)=>{
  db.authenticate()
    .then(() => console.log('Database connected...'))
    .then(function() {
      Game.create({
        hostUid: '1',
        guestUid: '2'
      })
    })
    .then(() => console.log('Successfully created a game.'))
    .then(_ => response.json('Successfully created a game.'))
    .catch(
      error => { 
        console.log(error)
        response.json({ error })
      }
    )
});

router.get('/getGames',(request,response,next) => {
  db.authenticate()
    .then(() => console.log('Database connected...'))
    .then(_=>Game.findAll())
    .then((results) => response.json(results))
    .catch(
      error => { 
        console.log(error)
        response.json({ error })
      }
    )
});


router.get('/:id', (request, response) => {
    const { id } = request.params;
    response.render('game', { id, title:'Game '+id});
  });
    

  module.exports = router;
  