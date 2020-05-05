const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const models = require("../../models/associations")
const Game = models["Game"];

router.get('/', (request, response, next) => {
  response.render('game', { title: 'Gamepage' });
});
  

//test: creates a game with two pre-determined Uids.
router.post('/test/create', (request,response,next)=>{
  Game.create({
    hostUid: "4e576e8b-da82-48d9-af72-3d3310f6518b",
    guestUid: "b4631842-ed7e-4a90-a7bf-93e6e95a479c",
  })
  .then((result) => {
    response.json(result)
  })
});

//creates a game with only host
//format: ../api/game/create/some host id
router.post('/create/:hUid/', (request,response,next)=>{
  const { hUid } = request.params;
  Game.create({
    hostUid: hUid,
  })
  .then((result) => {
    response.json(result)
  })
});

//creates a game with host and guest
//format: ../api/game/create/some host id/some guest id
router.post('/create/:hUid/:gUid', (request,response,next)=>{
  const { hUid } = request.params;    
  const { gUid } = request.params;
  Game.create({
    hostUid: hUid,
    guestUid: gUid,
  })
  .then((result) => {
    response.json(result)
  })
});

//creates multiple games with only host 
//format: ../api/game/createbulk/some host id/
router.post("/createbulk/:hUid", (request, response, next) => {
  const { hUid } = request.params;
  Game.bulkCreate([
    { hostUid: hUid},
    { hostUid: hUid},
    { hostUid: hUid},
])
.then((results) =>{
    response.json(results)
})
.catch((err)=>{
    response.json(err)
})
});

//shows all games
router.get('/getAll',(request,response,next) => {
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
  