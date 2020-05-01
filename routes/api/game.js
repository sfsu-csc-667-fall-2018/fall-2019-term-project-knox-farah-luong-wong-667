const express = require('express');
const router = express.Router();
const db = require('../../db');


router.get('/', (request, response, next) => {
  response.render('game', { title: 'Gamepage' });
});
  

router.get("/gamelist", (request, response) => {
  db.any(`SELECT * FROM games`)
  .then( results => response.json( results ) )
  .catch( error => {
    console.log( error )
    response.json({ error })
  })
});

//still need to get this to work 
//emulates a game being created
 router.get("/testcreate", (request, response) => {
   db.any(`SELECT id FROM users WHERE id IN (1,2)`)
   .then(results => response.json( results ))
   .then(`INSERT INTO games ("hostUid", "guestUid") VALUES ("1", "2")`)
   .catch( error => {
       console.log( error )
       response.json({ error })
    })
 });

router.get('/:id', (request, response) => {
    const { id } = request.params;
    response.render('game', { id, title:'Game '+id});
  });
    

  
  module.exports = router;
  