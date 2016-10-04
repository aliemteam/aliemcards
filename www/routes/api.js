/**
* ALiEM Cards API v 0.1.0
*
* JSON response based on JSend standards: http://labs.omniti.com/labs/jsend
* http://stackoverflow.com/questions/12806386/standard-json-api-response-format
*
**/

var express = require('express');
var router = express.Router();
var path = require('path');
var C = require('../constants');
var store = C.CARDS;
var cards = require(path.join(C.CARDS_META, '/cards'));
var categories = require(path.join(C.CARDS_META, '/categories'));
var tags = require(path.join(C.CARDS_META, '/tags'));


// RESPONSE HELPER
var apires = function(status, data) {
  return {
    status: status,
    data: data
  };
}

router.get('/', function(req, res){
  res.send('Here is the api');
});

// CARDS

router.get('/cards', function(req, res) {
  res.send(apires("success", cards));
});

router.get('/cards/:slug', function(req, res) {
  var card_summary = cards[req.params.slug];
  if (card_summary) {
    res.sendFile(path.join(store, card_summary.slug + '.json'));
  } else {
    res.json({ status: "fail", data: "Card not found."});
  }
});

// CATEGORIES

router.get('/categories', function(req, res){
  res.json(apires("success", categories));
});

router.get('/categories/:slug', function(req, res){
  var slug = categories[req.params.slug];
  var response = (slug) ? apires("success", slug) : apires("fail", "Category not found");
  res.json(response);
});

// TAGS

router.get('/tags', function(req, res) {
  res.json(apires("success", tags));
});

router.get('/tags/:slug', function(req, res) {
  var slug = tags[req.params.slug];
  var response = (slug) ? apires("success", slug) : apires("fail", "Tag not found");
  res.json(response);
});

module.exports = router;
