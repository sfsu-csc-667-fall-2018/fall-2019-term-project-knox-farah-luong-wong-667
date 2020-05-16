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
  .then((result) => { //Make sure game board is returned at some point
    if(result.length < 7) {
      response.redirect("/api/game/fillPlayerHand")
    } else {
      console.log("Player Hand:")
      console.log(result)
      Tile.findAll({
        where: {
          GameId: request.session.gid,
          [Sequelize.Op.not]: [
            {xCoordinate: null}
          ]
        }
      })
      .then((gameBoard) => {
        console.log("Game Board:")
        console.log(gameBoard)
        response.render("../views/authenticated/game", { username: request.session.username, playerHand: result, gameBoard: gameBoard })
      })
    }
  })
})

module.exports = router;
