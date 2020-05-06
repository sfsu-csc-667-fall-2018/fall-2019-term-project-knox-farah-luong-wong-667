const express = require("express");
const router = express.Router();
const models = require("../models/associations");
const User = models["User"];

// Needs work/discuss this
// router.get("/", (request, response, next) => {
//   response.render("layout", {
//     text: "Implement authentication, should have an id",
//     condition: false,
//   });
// });

router.get("/", (request, response, next) => {
    response.render("authenticated/game",{ username: request.session.username })
});
module.exports = router;
