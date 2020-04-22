const pgp = require('pg-promise')();
require('dotenv').config()
const connection = pgp(process.env.DATABASE_URL + "?ssl=true");

module.exports = connection;