var express = require('express');
var router = express.Router();
var C = require('../constants');
var tags = require( C.CARDS_META + '/tags');

router.get('/', function(req, res) {
  res.send('API home page');
});

router.get('/tags', function(req, res) {
  res.json(tags);
});

router.get('/tags/:slug', function(req, res) {
  var data = tags[req.params.slug] != null ? tags[req.params.slug] : 'Error: not found';
  res.json(data);
});

module.exports = router;
