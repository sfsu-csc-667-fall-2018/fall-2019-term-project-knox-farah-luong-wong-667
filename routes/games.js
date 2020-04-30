const express = require("express");
const router = express.Router();
const db = require("../db/index");

// Needs work/discuss this
router.get("/", (request, response, next) => {
  response.render("layout", {
    text: "Implement authentication, should have an id",
    condition: false,
  });
});

module.exports = router;
