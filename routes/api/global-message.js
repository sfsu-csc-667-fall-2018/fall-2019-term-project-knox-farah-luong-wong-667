const express = require("express");
const router = express.Router();
const models = require("../../models/associations");
const GlobalMessage = models["GlobalMessage"];
const User = models["User"];

router.get("/get/", (request, response, next) => {
    GlobalMessage.findAll({
        where: { UserId: request.body.uid },
        include: {
            model: User
        }
    })
        .then((results) => {
            response.json(results)
        })
        .catch((err) => {
            response.json(err)
        })
});

router.post("/create/", (request, response, next) => {
    GlobalMessage.create({
        UserId: request.session.uid,
        body: request.body.messageBody
    })
        .then(function (data) {
            if (data) {
                response.redirect('/lobby');
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