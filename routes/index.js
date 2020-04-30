var express = require('express');
var router = express.Router();
const db = require('../db/index');

/* GET home page. */
router.get('/', function(request, response, next) {
  response.render('index', { title: 'Scrabble' });
});

router.get('/junk', function(request, response, next) {
});

module.exports = router;
