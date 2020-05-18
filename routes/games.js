const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const models = require("../models/associations");
const User = models["User"];
const Game = models["Game"];
const Tile = models["Tile"];
const UserGame = models["UserGame"];

router.get("/", (request, response, next) => {
  Tile.findAll({
    where: {
      GameId: request.session.gid,
      UserId: request.session.uid,
      xCoordinate: null,
      yCoordinate: null
    }
  })
  .then((result) => {
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
        var gameArray = [
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
          new Array(15),
        ]
        gameBoard.forEach((object) => {
          gameArray[object.xCoordinate][object.yCoordinate] = object
        })
        UserGame.findOne({
          where: {
            GameId: request.session.gid,
            UserId: request.session.uid
          }
        }).then((userGameResult) => {
          UserGame.findOne({
            where: {
              GameId: request.session.gid,
              [Sequelize.Op.not]: [
                {UserId: request.session.uid}
              ]
            }
          }).then((opponentGameResults) => {
            User.findOne({
              where: {
                id: opponentGameResults.UserId
              }
            }).then((opponentUserResult) => {
              Game.findOne({
                where: {
                  id: request.session.gid
                },
                include: User
              }).then((gameResult) => {
                Tile.findAll({
                  where: {
                    GameId: request.session.gid,
                    UserId: null
                  }
                }).then((tileBagResults) => {
                  gameResult.update({
                    isWon: (tileBagResults == undefined)
                  }).then((finalResults) => {
                    response.render("../views/authenticated/game", { uid: request.session.uid, username: request.session.username, opponentUsername: opponentUserResult.username, playerHand: result, gameBoard: gameArray, gameData: userGameResult, opponentGameData: opponentGameResults, gameMetadata: gameResult })
                  })
                })
              })
            })
          })
        })
      })
    }
  })
})

module.exports = router;
