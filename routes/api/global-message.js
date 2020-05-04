const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const db = require("../../db/index");
const GlobalMessageModel = require("../../models/globalmessage")
const GlobalMessage = GlobalMessageModel(db, Sequelize);

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
    GlobalMessage.findAll()
    .then((results) => {
        response.json(results)
    })
})

module.exports = router;