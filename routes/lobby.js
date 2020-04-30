const express = require("express");
const router = express.Router();
const db = require("../db/index");

/* GET home page. */
router.get("/", (request, response, next) => {
  response.render("authenticated/lobby", { title: "Lobby page" });
});

module.exports = router;
