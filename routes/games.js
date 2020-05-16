const express = require("express");
const router = express.Router();
const models = require("../models/associations");
const User = models["User"];
const Tile = models["Tile"];

// Needs work/discuss this
// router.get("/", (request, response, next) => {
//   response.render("layout", {
//     text: "Implement authentication, should have an id",
//     condition: false,
//   });
// });

router.get("/", (request, response, next) => {
  const playerhand = []
  response.render("authenticated/game",{ username: request.session.username, playerhand: playerhand })
});

//returns player's hand 
//game id is pre-determined for now
router.get("/test", (request, response, next) => {
    gid = "1fab3405-4142-42be-8881-386359524428"
    Tile.findAll({
        where: {
          GameId: gid,
          UserId: request.session.uid,
          xCoordinate: null,
          yCoordinate: null
        }
      })
      .then((result) => {
        console.log(result)
        response.render("authenticated/game",{ username: request.session.username , playerhand: result})
    })
})

module.exports = router;
