var express = require('express');
var router = express.Router();
const db = require('../db/index');

/* GET home page. */
router.get('/', function(request, response, next) {
  response.render('index', { title: 'Testy test test' });
});

router.get('/test', function (request, response, next) {
    db.query(`INSERT INTO test_table ("testString") VALUES ('Hello at ${Date.now()}')`)
    .then( _ => db.query(`SELECT * FROM test_table`) )
    .then( results => response.json( results ) )
    .catch( error => {
        console.log( error )
    })
});

module.exports = router;
