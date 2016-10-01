var express = require('express');
var router = express.Router();
var C = require('../constants');
var tags = require( C.STORE_JSON + '/tags');

router.get('/', function(req, res) {
  res.send('API home page');
});

router.get('/tags', function(req, res) {
  res.json(tags);
})

module.exports = router;
