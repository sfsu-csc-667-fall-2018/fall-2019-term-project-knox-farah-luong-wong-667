const Sequelize = require("sequelize");
const express = require("express");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const db = require("../../db/index");
const UserModel = require("../../models/user");
const User = UserModel(db, Sequelize);

  router.post("/create", function (request, response, next) {
      bcrypt.hash(request.body.passwordsignup, saltRounds, function (err, hash) {
          User.create({
              email: request.body.emailsignup,
              password: hash,
              username: request.body.usernamesignup
          }).then(function(data) {
              if(data) {
                  response.redirect('/');
              }
          });
      });
  });

  router.post('/verify', function (request, response, next) {
      User.findOne({
          where: {
              email: request.body.email
          }
      }).then(function(user) {
          if(!user) {
              response.redirect('/');
          } else {
              bcrypt.compare(request.body.password, user.password, function (err, result) {
                  if (result == true) {
                      response.send(user);
                  } else {
                      response.send('Incorrect password');
                  }
              });
          }
      });
  });

  module.exports = router;