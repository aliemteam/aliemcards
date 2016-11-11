/**
* ALiEM Cards API v 0.2.0
*
* JSON response based on JSend standards: http://labs.omniti.com/labs/jsend
* http://stackoverflow.com/questions/12806386/standard-json-api-response-format
*
**/
// Get environemental variables
require('dotenv').config();

// ExpressJS Config
const express = require('express');
const router = express.Router();

// MongooseJS Config
// first variable is the OpenShift custom variable, second is the dev default
const mlaburi = process.env.MLAB_CONNECT_STRING || process.env.MLAB_URI;


const mongoose = require('mongoose');
const Card = require('../../build_db/models/card');
const Tag = require('../../build_db/models/taxonomy').tag;
const Category = require('../../build_db/models/taxonomy').category;
mongoose.Promise = require('bluebird');

mongoose.connect(mlaburi);

// RESPONSE HELPER
const apires = (s, d) => ({ status: s, data: d });

// INDEX

router.get('/', (req, res) => {
  res.send('Here is the api');
});

// CARDS

router.get('/cards', (req, res) => {
  Card.find()
  .select('slug title categories')
  .sort({ title: 1 })
  .exec()
  .then((cards) => {
    res.json(apires('success', cards));
  })
  .catch((error) => {
    res.json(apires('fail', `database error: ${error}`));
  });
});

router.get('/cards/:slug', (req, res) => {
  const searchSlug = req.params.slug;
  Card.findOne({ slug: searchSlug }).exec()
  .then((card) => {
    if (card) {
      res.json(apires('success', card));
    } else {
      res.json(apires('fail', 'card not found'));
    }
  })
  .catch((error) => {
    res.json(apires('fail', `database error: ${error}`));
  });
});

// CATEGORIES

router.get('/categories', (req, res) => {
  Category.find().sort({ title: 1 })
  .exec()
  .then((cats) => {
    res.json(apires('success', cats));
  })
  .catch((error) => {
    res.json(apires('fail', `database error: ${error}`));
  });
});

router.get('/categories/:slug', (req, res) => {
  const searchSlug = req.params.slug;
  const category = {};
  Category.findOne({ slug: searchSlug })
  .exec()
  .then((cat) => {
    category.title = cat.title;
    category.slug = cat.slug;
    return Card.find({ categories: cat.slug })
      .sort({ slug: 1 })
      .select('slug title categories')
      .exec();
  })
  .then((cards) => {
    category.cards = cards;
    res.json(apires('success', category));
  })
  .catch((error) => {
    res.json(apires('fail', `database error: ${error}`));
  });
});

// TAGS

router.get('/tags', (req, res) => {
  Tag.find().sort({ title: 1 })
  .exec()
  .then((tags) => {
    res.json(apires('success', tags));
  })
  .catch((error) => {
    res.json(apires('fail', `database error: ${error}`));
  });
});

router.get('/tags/:slug', (req, res) => {
  const searchSlug = req.params.slug;
  const tag = {};
  Tag.findOne({ slug: searchSlug })
  .exec()
  .then((foundtag) => {
    tag.title = foundtag.title;
    tag.slug = foundtag.slug;
    return Card.find({ tags: foundtag.title })
      .sort({ title: 1 })
      .select('slug title categories')
      .exec();
  })
  .then((cards) => {
    tag.cards = cards;
    res.json(apires('success', tag));
  })
  .catch((error) => {
    res.json(apires('fail', `database error: ${error}`));
  });
});

// SEARCH

router.get('/search/:query', (req, res) => {
  const query = new RegExp(req.params.query, 'i');
  // Card.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
  // .sort({ score: { $meta: 'textScore' } })
  Card.find({ content: query })
  .exec()
  .then((cards) => {
    res.json(apires('success', cards));
  })
  .catch((error) => {
    res.json(apires('fail', `database error: ${error}`));
  });
});

// NEWEST

router.get('/recent', (req, res) => {
  Card.find()
  .sort('-updated')
  .limit(5)
  .select('slug title categories')
  .exec()
  .then((cards) => {
    res.json(apires('success', cards));
  })
  .catch((error) => {
    res.json(apires('fail', `database error: ${error}`));
  });
});

module.exports = router;
