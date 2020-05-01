const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const db = require("../db/index");
const UserModel = require("../models/user");
const User = UserModel(db, Sequelize);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
