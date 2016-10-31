const gulp = require('gulp');
const gutil = require('gulp-util');
// const debug = require('gulp-debug');
const through = require('through2');
const fm = require('gulp-front-matter');
const marked = require('marked');
const crypto = require('crypto');

const config = require('./config');
const mongoose = require('mongoose');
const Card = require('./build_db/models/card');
const Tag = require('./build_db/models/taxonomy').tag;
const Category = require('./build_db/models/taxonomy').category;

mongoose.Promise = require('bluebird');
mongoose.connect(config.development.mlaburi);

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

// Create checksum hash of string or buffer
// https://blog.tompawlak.org/calculate-checksum-hash-nodejs-javascript
const checksum = function checksum(str, algorithm, encoding) {
  return crypto
      .createHash(algorithm || 'md5')
      .update(str, 'utf8')
      .digest(encoding || 'hex');
};

// Slugify
const slugify = function slugify(text) {
  return text
  .toString()
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');
};

// ////////////////////////////////////
// MLAB DATABASE BUILD build_db
// gulp build_db --gulpfile gulpfile-db.js
// ////////////////////////////////////

gulp.task('upload_db', () =>
  gulp.src('./cards/*.md')
  // .pipe(debug({ title: 'build_db:' }))

  // add hash to file object
  .pipe(through.obj((file, enc, callback) => {
    const refile = file;
    refile.hash = checksum(file.contents);
    this.push(refile);
    callback();
  }))

  // extract frontmatter into meta property
  .pipe(fm({ property: 'meta', remove: true }))

  // Process card, add to dbase if new or updated
  .pipe(through.obj((file, enc, callback) => {
    // filename minus .md extension
    const cardSlug = file.relative.split('.')[0].toLowerCase();
    const splitTags = (file.meta.tags) ? file.meta.tags.split(', ') : null;
    const card = new Card({
      title: file.meta.title,
      slug: cardSlug,
      tags: splitTags,
      categories: file.meta.collection,
      content: marked(file.contents.toString()),
      hash: file.hash,
      updatedAt: new Date(),
    });

    Card.findOne({ slug: card.slug }).exec()
      .then((doc) => {
        // if card in dbase return found card, else save the new card and return it
        if (doc !== null) {
          gutil.log(gutil.colors.green(`!!! Found ${doc.title}`));
          return doc;
        }
        gutil.log(gutil.colors.magenta(`$$$ Saved ${card.title}`));
        return card.save();
      })
      .then((foundCard) => {
        // if card hash != foundCard hash, then update dbase with new card
        if (foundCard.hash !== card.hash) {
          gutil.log(gutil.colors.magenta(`UUU Updating UUU : ${card.title}`));
          foundCard.title = card.title;
          foundCard.tags = card.tags;
          foundCard.categories = card.categories;
          foundCard.content = card.content;
          foundCard.hash = card.hash;
          foundCard.updatedAt = new Date();
          return foundCard.save();
        }
        return foundCard;
      })
      .catch((err) => {
        gutil.log(gutil.colors.magenta(err));
      });

    file.card = card;
    this.push(file);
    callback();
  }))
  // buffer all cards into string to handle tags and categories
  .pipe(gutil.buffer())
  .pipe(through.obj((files, enc, callback) => {
    // create master array of categories and tags
    const categories = [];
    const tags = [];

    files.forEach((file) => {
      const filecats = file.card.categories;
      const filetags = file.card.tags;

      // only add tags or categories to running array if they are unique
      filecats.forEach((cat) => {
        if (categories.indexOf(cat) === -1) categories.push(cat);
      });

      if (filetags) {
        filetags.forEach((tag) => {
          if (tags.indexOf(tag) === -1) tags.push(tag);
        });
      }
    });

    // add new categories to dbase if not there already
    categories.forEach((cat) => {
      Category.findOne({ title: cat }).exec()
        .then((doc) => {
          if (doc === null) {
            const newCat = new Category({ title: cat, slug: slugify(cat) });
            return newCat.save();
          }
          return doc;
        })
        .catch((err) => { gutil.log(gutil.colors.magenta(err)); });
    });

    // add new tags to dbase if not there already
    tags.forEach((tag) => {
      Tag.findOne({ title: tag }).exec()
      .then((doc) => {
        if (doc === null) {
          const newTag = new Tag({ title: tag, slug: slugify(tag) });
          return newTag.save();
        }
        return doc;
      })
      .catch((err) => { gutil.log(gutil.colors.magenta(err)); });
    });

    callback();
  }))
);

gulp.task('build_db', ['upload_db'], () => {
  // mongoose.connection.close();
});
