const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const models = require("../models/associations");
const GlobalMessage = models["GlobalMessage"];
const User = models["User"];
const UserGame = models["UserGame"];
const Game = models["Game"];

router.get("/", (request, response, next) => {
  GlobalMessage.findAll({
    include: {
      model: User
    }
  })
    .then((results) => {
      UserGame.findAll({
        raw: true,
        group: ['GameId'],
        attributes: ['GameId', [Sequelize.fn('COUNT', 'GameId'), 'GameIdCount']],
      })
      .then((UserGameResults) => {
        var availableGameIds = []
        UserGameResults.forEach((object) => {
          if(object.GameIdCount < 2) {
            availableGameIds.push(object.GameId)
          }
        })
        Game.findAll({
          where: {
            id: availableGameIds
          },
          include: User
        }).then((availableGamesResults) => {
          response.render("authenticated/lobby", { title: "lobby page", messages: results, username: request.session.username, availableGames: availableGamesResults})
        })
      })
    })
});

module.exports = router;
