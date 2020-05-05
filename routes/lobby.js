const express = require("express");
const router = express.Router();
const models = require("../models/associations");
const GlobalMessage = models["GlobalMessage"];
const User = models["User"];

/* GET home page. */
router.get("/", (request, response, next) => {
  GlobalMessage.findAll({
    include: {
        model: User
    }
  })
  .then((results) => {
    console.log(results)
    response.render("authenticated/lobby", { title: "lobby page", messages: results })
  })
});

module.exports = router;
