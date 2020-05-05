const express = require("express");
const router = express.Router();
const models = require("../../models/associations");
const GlobalMessage = models["GlobalMessage"];
const User = models["User"];

router.get("/get/", (request, response, next) => {
    const { uid } = request.body.uid;
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

router.get("/getone/", (request, response, next) => {
    const { uid } = request.body.uid;
    GlobalMessage.findOne({
        where: {
          UserId: 'fc611516-a549-476c-b8b5-f16cd70d0b98'
        },
        include: {
            model: User
        }
    })
    .then((result) => {
        response.json(result)
    })
})

router.post("/create/", (request, response, next) => {
    GlobalMessage.create({
        UserId: request.body.uid,
        body: request.body.messageBody
    })
    .then(function(data) {
        if(data) {
            response.json(data);
        }
    })
    .catch((err) => {
        response.send("Error: ", err)
    })
})

router.get("/getMessages", function (request, response, next) {
    GlobalMessage.findAll({
        include: {
            model: User
        }
    })
    .then((results) => {
        response.json(results)
    })
})

module.exports = router;