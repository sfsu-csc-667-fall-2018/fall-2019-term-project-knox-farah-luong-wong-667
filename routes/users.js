var express = require('express');
var router = express.Router();
const db = require('../db/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at ${Date.now()}')`)
 .then( _ => db.any(`SELECT * FROM test_table`) )
 .then( results => res.json( results ) )
 .catch( error => {
 console.log( error )
 res.json({ error })
 })
});

module.exports = router;
