var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  response.render('index', { title: 'Testy test test' });
});

router.get('/test', function (request, response, next) {
    response.render('test', { title: 'Test' })
});

module.exports = router;
