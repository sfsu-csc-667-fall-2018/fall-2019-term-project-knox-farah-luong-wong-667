const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const models = require("../models/associations");
const User = models["User"];
const Tile = models["Tile"];

router.get("/", (request, response, next) => {
  Tile.findAll({
    where: {
      GameId: request.session.gid,
      UserId: request.session.uid,
      xCoordinate: null,
      yCoordinate: null
    }
  })

   //hand's logic
  .then((result) => {
    if(result.length < 7) {
      response.redirect("/api/game/fillPlayerHand")
    } else {
      console.log(result)
      response.render("../views/authenticated/game", { username: request.session.username, playerHand: result })
    }
  })


  //board's logic (WIP)
  .then((result) => {
    if(result.length < 15) {
      response.redirect("/api/game/Tile")
    } else {
      console.log(result)
      response.render("../views/authenticated/game", { username: request.session.username, playerHand: result })
    }
  })
})

module.exports = router;
