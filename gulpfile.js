const gulp = require('gulp');
const gutil = require('gulp-util');
// const debug = require('gulp-debug');
const through = require('through2');
const fm = require('gulp-front-matter');
const marked = require('marked');
const crypto = require('crypto');
const slug = require('slug');

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

// ////////////////////////////////////
// MLAB DATABASE BUILD build_db
// gulp build_db
// ////////////////////////////////////

gulp.task('upload_db', () =>
  gulp.src('./cards/*.md')
  // .pipe(debug({ title: 'build_db:' }))

  // add hash to file object
  .pipe(through.obj(function(file, enc, callback) {
    const refile = file;
    refile.hash = checksum(file.contents);
    this.push(refile);
    callback();
  }))

  // extract frontmatter into meta property
  .pipe(fm({ property: 'meta', remove: true }))

  // Process card, add to dbase if new or updated
  .pipe(through.obj(function(file, enc, callback) {
    // filename minus .md extension
    const cardSlug = file.relative.split('.')[0].toLowerCase();
    const splitTags = (file.meta.tags) ? file.meta.tags.split(', ') : null;
    const cats = file.meta.collection.map((cat) => slug(cat, { lower: true }));
    const updates = (file.meta.updated) ? file.meta.updated.map((update) => new Date(update)) : null;
    const card = new Card({
      title: file.meta.title,
      slug: cardSlug,
      tags: splitTags,
      categories: cats,
      authors: file.meta.authors,
      created: new Date(file.meta.created),
      updated: updates,
      content: marked(file.contents.toString()),
      hash: file.hash,
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
          foundCard.title = card.title;
          foundCard.tags = card.tags;
          foundCard.categories = card.categories;
          foundCard.authors = card.authors;
          foundCard.created = card.created;
          foundCard.updated = card.updated;
          foundCard.content = card.content;
          foundCard.hash = card.hash;
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
      const filecats = file.meta.collection;
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
      const catSlug = slug(cat, { lower: true });
      Category.findOne({ slug: catSlug })
      .exec()
      .then((doc) => {
        if (doc === null) {
          const newCat = new Category({ title: cat, slug: catSlug });
          return newCat.save();
        }
        return doc;
      })
      .catch((err) => { gutil.log(gutil.colors.magenta(err)); });
    });

    // add new tags to dbase if not there already
    tags.forEach((tag) => {
      const tagSlug = slug(tag, { lower: true });
      Tag.findOne({ slug: tagSlug })
      .exec()
      .then((doc) => {
        if (doc === null) {
          const newTag = new Tag({ title: tag, slug: tagSlug });
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
  // ??? Not sure when to close connection!
  // Can't figure out how to wait for promises from prior task to resovle
  // mongoose.connection.close();
});
