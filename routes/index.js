const express = require("express");
const router = express.Router();
const associations = require("../models/associations");
const Tile = associations["Tile"];
const Game = associations["Game"];
const UserGame = associations["UserGame"];
const User = associations["User"];

router.get("/", function (req, res, next) {
  if(req.session.uid != undefined) {
    UserGame.findAll({
      where: {
        UserId: req.session.uid,
      },
    })
    .then((userGameResults) => {
      var myGameIds = []
      userGameResults.forEach((object) => {
        myGameIds.push(object.GameId)
      })
      Game.findAll({
        where: {
          id: myGameIds
        },
        include: User
      }).then((myGames) => {
        res.render("index", {title: "Express", username: req.session.username, myGames: myGames})
      })
    })
    .catch((err) => {
      res.send(err)
    })
  } else {
    res.render("index", { title: "Express", username: req.session.username, myGames: [] });
  }
});

router.get("/tileTest", function(request, response, next) {
  Tile.create({
    xCoordinate: 1,
    yCoordinate: 1,
    letter: 'A',
    GameId: 'dda9fc91-2b14-4cfe-aca5-95486af9058f'
  }).then(_ => {
    Tile.findAll({
      include: {
        model: Game
      }
    }).then((results) => {
      response.json(results)
    })
  })
})

module.exports = router;
