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

router.get("/logout", (request, response, next) => {
  request.session.uid = null
  request.session.gid = null
  request.session.username = null
  request.session.email = null
  response.render("index", { title: "Express"})
})

module.exports = router;
