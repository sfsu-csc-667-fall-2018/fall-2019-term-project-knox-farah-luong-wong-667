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



// router.get("/createUser", function (request, response, next) {
//   db.authenticate()
//     .then(() => console.log('Database connected...'))
//     .then(function() {
//       User.create({
//         email: 'test01@gmail.com',
//         password: 'password',
//         username: 'cool_username'
//       })
//     })
//     .then(User.findAll())
//     .then((results) => response.json(results))
//     .catch(err => console.log('Error: ' + err))
// });


// router.get("/gamelist", (request, response) => {
//   db.any(`SELECT * FROM Games`)
//   .then( results => response.json( results ) )
//   .catch( error => {
//     console.log( error )
//     response.json({ error })
//   })
// });

// router.get("/users", (request, response) => {
//   db.any(`SELECT * FROM users`)
//   .then( results => response.json( results ) )
//   .catch( error => {
//     console.log( error )
//     response.json({ error })
//   })
// });

// //still need to get this to work 
// //emulates a game being created
//  router.get("/testcreates", (request, response) => {
//    db.any(`SELECT * FROM User`)
//    .then(results => response.json( results ))
//    .then(`INSERT INTO games ("hostUid", "guestUid") VALUES ("1", "2")`)
//    .catch( error => {
//        console.log( error )
//        response.json({ error })
//     })
//  });

router.get('/:id', (request, response) => {
    const { id } = request.params;
    response.render('game', { id, title:'Game '+id});
  });
    

  module.exports = router;
  