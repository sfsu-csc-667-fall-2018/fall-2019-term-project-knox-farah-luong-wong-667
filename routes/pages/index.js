const express = require("express");
const router = express.Router();
const db = require("../db/index");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/register", (request, response, next) => {
  response.render("unauthenticated/register", { title: "Register Page" });
});

router.get("/login", (request, response, next) => {
  response.render("unauthenticated/login", { title: "Login page" });
});

module.exports = router;
