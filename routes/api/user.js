const Sequelize = require("sequelize");
const express = require("express");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const db = require("../../db/index");
const UserModel = require("../../models/user");
const User = UserModel(db, Sequelize);
const GlobalMessageModel = require("../../models/globalmessage")
const GlobalMessage = GlobalMessageModel(db, Sequelize);


  router.get("/getUsers", function (request, response, next) {
      User.findAll()
      .then((results) => {
          response.json(results)
      })
  })

  router.get("/test/getall", (request, response, next) => {
     GlobalMessage.findAll()
     .then((results) =>{
         response.json(results)
     })
  });

  router.get("/test/get/:uid", (request, response, next) => {
    const { uid } = request.params;
    GlobalMessage.findAll({
        where: { UserId: uid }
    })
  .then((results) =>{
      response.json(results)
  })
  .catch((err)=>{
      response.json(err)
  })
});

  router.post("/test/createbulk/:uid", (request, response, next) => {
      const { uid } = request.params;
    GlobalMessage.bulkCreate([
        {body: 'Body of message 1',  UserId: uid},
        {body: 'Body of message 2',  UserId: uid},
        {body: 'Body of message 3',  UserId: uid}
    ])
    .then((results) =>{
        response.json(results)
    })
    .catch((err)=>{
        response.json(err)
    })
  });

  router.post("/test/createnull", (request, response, next) => {

    GlobalMessage.bulkCreate([
       {body: 'Body of message 1'},
       {body: 'Body of message 2'},
       {body: 'Body of message 3'}
    ])
  .then((results) =>{
      response.json(results)
  })
  .catch((err)=>{
      response.json(err)
  })
});
  
  router.post("/test/find1", function (request, response, next) {

    GlobalMessage.findAll({
        where: {body: 'Body of message 1'}
    })
    .then((foundUser) => {
        response.json(foundUser)
    })
    .catch((err) => {
        console.log("Error while finding user: ", err)
    })
  })


  router.get("/getMessages", function (request, response, next) {
    GlobalMessage.findAll()
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

  router.post("/bulkCreate", function (request, response, next) {
    User.create({
        email: 'testRelation@gmail.com',
        password: 'password',
        username: 'Test Relation'
    }).then((newUser) => {
        GlobalMessage.bulkCreate([
            {body: 'Body of message 1',  UserId: newUser},
            {body: 'Body of message 2',  UserId: newUser},
            {body: 'Body of message 3',  UserId: newUser}
        ])
    })
    .then((newMessages) => {
        response.json(newMessages);
    })
    .catch((err) => {
        console.log("Error while creating users: ", err);
    })
  })

  router.post("/findOne", function (request, response, next) {
    GlobalMessage.findOne({
        where: {body: 'Body of message 1'}, include: [{model: User}]
    })
    .then((foundUser) => {
        response.json(foundUser)
    })
    .catch((err) => {
        console.log("Error while finding user: ", err)
    })
  })

  module.exports = router;