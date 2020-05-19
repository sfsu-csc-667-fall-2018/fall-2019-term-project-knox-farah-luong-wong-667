const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require('body-parser');
const session = require('express-session');

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const testsRouter = require("./routes/tests");
const gamesRouter = require("./routes/games");
const gameApiRouter = require("./routes/api/game");
const userApiRouter = require("./routes/api/user");
const globalMessageApiRouter = require("./routes/api/global-message");
const lobbyRouter = require("./routes/lobby");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({secret: "Shh, its a secret!"}));



const options = {
  inflate: true,
  limit: 1000,
  defaultCharset: 'utf-8'
};
app.use(bodyParser.text(options))

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tests", testsRouter);
app.use("/games", gamesRouter);
app.use("/lobby", lobbyRouter);
app.use("/api/game", gameApiRouter);
app.use("/api/user", userApiRouter);
app.use("/api/global-message", globalMessageApiRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
