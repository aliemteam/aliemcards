/**
* ALiEM Cards API v 0.1.0
*
* JSON response based on JSend standards: http://labs.omniti.com/labs/jsend
* http://stackoverflow.com/questions/12806386/standard-json-api-response-format
*
**/

const express = require('express');
const router = express.Router();
const path = require('path');

// get constants
const C = require('../cons');
const store = C.CARDS;
const cards = require(path.join(C.CARDS_META, '/cards'));
const categories = require(path.join(C.CARDS_META, '/categories'));
const tags = require(path.join(C.CARDS_META, '/tags'));


// RESPONSE HELPER
const apires = function apires(s, d) {
  return {
    status: s,
    data: d,
  };
};

// INDEX

router.get('/', (req, res) => {
  res.send('Here is the api');
});

// CARDS

router.get('/cards', (req, res) => {
  res.send(apires('success', cards));
});

router.get('/cards/:slug', (req, res) => {
  const cardSummary = cards[req.params.slug.toLowerCase()];
  if (cardSummary) {
    res.sendFile(path.join(store, `${cardSummary.slug}.json`));
  } else {
    res.json({ status: 'fail', data: 'Card not found.' });
  }
});

// CATEGORIES

router.get('/categories', (req, res) => {
  res.json(apires('success', categories));
});

router.get('/categories/:slug', (req, res) => {
  const slug = categories[req.params.slug];
  const response = (slug) ? apires('success', slug) : apires('fail', 'Category not found');
  res.json(response);
});

// TAGS

router.get('/tags', (req, res) => {
  res.json(apires('success', tags));
});

router.get('/tags/:slug', (req, res) => {
  const slug = tags[req.params.slug];
  const response = (slug) ? apires('success', slug) : apires('fail', 'Tag not found');
  res.json(response);
});

module.exports = router;
