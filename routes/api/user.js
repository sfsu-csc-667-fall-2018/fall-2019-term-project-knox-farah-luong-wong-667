const express = require("express");
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const models = require("../../models/associations");
const GlobalMessage = models["GlobalMessage"];
const User = models["User"];
const UserGame = models["UserGame"];


  router.get("/getUsers", function (request, response, next) {
      User.findAll()
      .then((results) => {
          response.json(results)
      })
  })

router.post("/create", function (request, response, next) {
    bcrypt.hash(request.body.passwordsignup, saltRounds, function (err, hash) {
        User.create({
            email: request.body.emailsignup,
            password: hash,
            username: request.body.usernamesignup
        }).then(function (data) {
            if (data) {
                sess = request.session;
                sess.email = data.email;
                sess.username = data.username;
                sess.uid = data.id;
                response.redirect('/');
            }
        });
    });
});

router.post('/getUserGames', function(request, response, next) {
    UserGame.findAll()
    .then((results) => {
        response.json(results)
    })
})

router.post('/verify', function (request, response, next) {
    User.findOne({
        where: {
            email: request.body.email
        }
    }).then(function (user) {
        if (!user) {
            response.redirect('/');
        } else {
            bcrypt.compare(request.body.password, user.password, function (err, result) {
                if (result == true) {
                    sess = request.session;
                    sess.email = user.email;
                    sess.username = user.username;
                    sess.uid = user.id;
                    response.redirect('/');
                } else {
                    response.send('Incorrect password');
                }
            });
        }
    });
});

  module.exports = router;
