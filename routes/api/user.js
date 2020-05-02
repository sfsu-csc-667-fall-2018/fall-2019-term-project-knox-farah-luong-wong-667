const Sequelize = require("sequelize");
const express = require("express");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const db = require("../../db/index");
const UserModel = require("../../models/user");
const User = UserModel(db, Sequelize);

router.get("/createUser", function (request, response, next) {
    db.authenticate()
      .then(() => console.log('Database connected...'))
      .then(function() {
        User.create({
          email: 'test01@gmail.com',
          password: 'password',
          username: 'cool_username'
        })
      })
      .then(User.findAll())
      .then((results) => response.json(results))
      .catch(err => console.log('Error: ' + err))
  });
  
  router.get("/getUsers", function (request, response, next) {
    db.authenticate()
      .then(() => console.log('Database connected...'))
      .then(_ => User.findAll())
      .then((results) => response.json(results))
      .catch(err => console.log('Error: ' + err))
  });

  router.post("/display", function (request, response, next) {
      db.authenticate()
        .then(console.log("Got body: ", request.body.emailsignup))
        .then(_ => response.send("Response"))
  });

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
                      response.json(user)
                      response.redirect('/');
                  } else {
                      response.send('Incorrect password');
                      response.redirect('/');
                  }
              });
          }
      });
  });

  module.exports = router;