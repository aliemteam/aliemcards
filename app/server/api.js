const express = require('express');
const mongoose = require('mongoose');
const { Card, Category, Tag } = require('./models/');

const router = express.Router(); // eslint-disable-line

const MLAB_CONNECT_STRING = process.env.MLAB_CONNECT_STRING;
mongoose.connect(MLAB_CONNECT_STRING);

// Response Helper
const response = (s, d) => ({ status: s, data: d });

// Auth middleware
// router.use((req, res, next) => {
//   console.log(JSON.stringify(req.headers));
//   if (req.get('ALIEM_CARDS_KEY') !== process.env.ALIEM_CARDS_KEY) {
//     res.status(401).send('=> ERROR: "aliem_api_key" header not set or invalid');
//     return;
//   }
//   next();
// });

// Auth middleware by domain/IP

router.use((req, res, next) => {
  console.log(`req.hostname: ${req.hostname}; req.ip: ${req.ip}`);
  next();
});

router.get('/', (req, res) => {
  res.send('Here is the api');
});

router.get('/cards', (req, res) => {
  Card.find()
  .select('slug title categories')
  .sort({ title: 1 })
  .exec()
  .then((cards) => {
    res.json(response('success', cards));
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

router.get('/cards/:slug', (req, res) => {
  const searchSlug = req.params.slug;
  Card.findOne({ slug: searchSlug }).exec()
  .then((card) => {
    if (card) {
      res.json(response('success', card));
    } else {
      res.json(response('fail', 'card not found'));
    }
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

router.get('/categories', (req, res) => {
  Category.find().sort({ title: 1 })
  .exec()
  .then((cats) => {
    res.json(response('success', cats));
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

router.get('/categories/:slug', (req, res) => {
  const slug = req.params.slug;
  const category = {};
  Category.findOne({ slug })
  .exec()
  .then((data) => {
    category.title = data.title;
    category.slug = data.slug;
    return Card.find({ categories: data.slug })
      .sort({ slug: 1 })
      .select('slug title categories')
      .exec();
  })
  .then((cards) => {
    category.cards = cards;
    res.json(response('success', category));
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

router.get('/tags', (req, res) => {
  Tag.find().sort({ title: 1 })
  .exec()
  .then((tags) => {
    res.json(response('success', tags));
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

router.get('/tags/:slug', (req, res) => {
  const searchSlug = req.params.slug;
  const tag = {};
  Tag.findOne({ slug: searchSlug })
  .exec()
  .then((data) => {
    tag.title = data.title;
    tag.slug = data.slug;
    return Card.find({ tags: data.title })
      .sort({ title: 1 })
      .select('slug title categories')
      .exec();
  })
  .then((cards) => {
    tag.cards = cards;
    res.json(response('success', tag));
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

router.get('/search/:query', (req, res) => {
  const query = new RegExp(req.params.query, 'i');
  // Card.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
  // .sort({ score: { $meta: 'textScore' } })
  Card.find({ content: query })
  .exec()
  .then((cards) => {
    res.json(response('success', cards));
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

router.get('/recent', (req, res) => {
  Card.find()
  .sort('-created')
  .limit(5)
  .select('slug title categories')
  .exec()
  .then((cards) => {
    res.json(response('success', cards));
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

router.get('/updated', (req, res) => {
  Card.find()
  .sort('-updates')
  .limit(5)
  .select('slug title categories updates')
  .exec()
  .then((cards) => {
    res.json(response('success', cards));
  })
  .catch((error) => {
    res.json(response('fail', `database error: ${error}`));
  });
});

module.exports = router;
