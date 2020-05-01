const Sequelize = require("sequelize");
const express = require("express");
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

  module.exports = router;