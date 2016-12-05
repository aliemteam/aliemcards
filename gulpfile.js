/**
 *
 * ALIEM Cards Build File
 * Gulp build process to upload cards to an mLab mongo database
 *
 */

const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const through = require('through2');
const fm = require('gulp-front-matter');
const marked = require('marked');
const slug = require('slug');
const YAML = require('yamljs');
const sequence = require('run-sequence');

// Get environemental variables
require('dotenv').config();
const mongoose = require('mongoose');
const Card = require('./db_schema/models/card');
const Category = require('./db_schema/models/taxonomy').category;

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


// ///////////////////////////////////////////////
// cards
// ///////////////////////////////////////////////

const buildCardObject = function(filename, meta, contents) {
  return {
    title: meta.title,
    slug: filename.split('.')[0].toLowerCase(),
    drugs: (meta.drugs) ? meta.drugs.split(', ') : null,
    categories: meta.categories.map((cat) => slug(cat, { lower: true })),
    authors: meta.authors,
    created: meta.created,
    updates: meta.updates,
    content: marked(contents.toString()),
  };
};

// make new Card documents based on directory of markdown files
// wrap in Promise to control async operations
const cardsToMongo = function(glob) {
  return new Promise((resolve, reject) => {
    gulp.src(glob)
    .pipe(fm({ property: 'meta', remove: true }))
    .pipe(through.obj(function(file, enc, done) {
      const card = new Card(buildCardObject(file.relative, file.meta, file.contents));
      this.push(card);
      card.save().then(() => done());
    }))
    // through2 has to send stream somewhere in order to emit 'end' event
    // github.com/rvagg/through2/issues/31
    .on('data', (card) => gutil.log(gutil.colors.green(`Saved ${card.title}`)))
    .on('end', resolve)
    .on('error', reject);
  });
};

gulp.task('cards', function() {
  mongoose.connect(process.env.MLAB_CONNECT_STRING);
  return Card.find()
  .remove({}) // empty Card collection
  .exec()
  .then(() => cardsToMongo('./cards/*.md'))
  .then(() => mongoose.connection.close())
  .catch((err) => gutil.log(gutil.colors.magenta(err)));
});

// ///////////////////////////////////////////////
// cats
// ///////////////////////////////////////////////

const buildUniqueCatArray = function(files) {
  const categories = [];

  files.forEach((file) => {
    const filecats = file.meta.categories;
    const cardSlug = file.relative.split('.')[0].toLowerCase();

    // only add categories to running array if they are unique
    filecats.forEach((cat) => {
      const catSlug = slug(cat, { lower: true });
      const foundCat = categories.find((e) => e.slug === catSlug);
      if (foundCat) {
        foundCat.cards.push(cardSlug);
      } else {
        categories.push({ title: cat, slug: catSlug, cards: [cardSlug] });
      }
    });
  });

  return categories;
};

const saveCat = function(cat) {
  return new Category(cat)
    .save()
    .then((saved) => gutil.log(gutil.colors.blue(`Category ${saved.title}`)));
};

const categoriesToMongo = function(glob) {
  return new Promise((resolve, reject) => {
    gulp.src(glob)
    .pipe(fm({ property: 'meta', remove: true })) // get frontmatter
    .pipe(gutil.buffer()) // buffer all cards into single array
    .pipe(through.obj(function(files, enc, done) {
      const categories = buildUniqueCatArray(files);
      const promises = Promise.all(categories.map(saveCat));
      promises.then(() => {
        this.push(categories);
        done();
      });
    }))
    .on('data', () => gutil.log(gutil.colors.magenta('Promise All Complete')))
    .on('end', resolve)
    .on('error', reject);
  });
};

gulp.task('cats', () => {
  mongoose.connect(process.env.MLAB_URI);
  return Category.find()
  .remove({}) // empty Category collection
  .exec()
  .then(() => categoriesToMongo('./cards/*.md'))
  .then(() => mongoose.connection.close())
  .catch((err) => gutil.log(gutil.colors.magenta(err)));
});


// ////////////////////////////////////
// default
// - run-sequence used to run each task in order
// - tasks can also be run individually
// ////////////////////////////////////

gulp.task('default', (callback) => sequence('cards', 'cats', callback));

// ///////////////////////////////////////////////
// new_yaml
// Utility function to modify cards
// ///////////////////////////////////////////////

// Task to convert old frontmatter to new format
gulp.task('new_yaml', () =>
  gulp.src('./oldcards/*.md')
  .pipe(debug({ title: 'build_db:' }))
  .pipe(fm({ property: 'meta', remove: true }))
  .pipe(through.obj(function (file, enc, callback) {
    const title = file.meta.title;
    const categories = file.meta.categories;
    const drugs = file.meta.drugs;
    const authors = file.meta.authors;
    const created = file.meta.updates.pop();
    const updates = (file.meta.updates.length > 0) ? file.meta.updates : null;
    const fmblock = '---\n\n';
    const content = file.contents.toString();

    const frontmatter = {
      title,
      authors,
      created,
      updates,
      categories,
      drugs,
    };

    const rebuildString = fmblock + YAML.stringify(frontmatter) + '\n' + fmblock + content;
    file.contents = new Buffer(rebuildString);
    this.push(file);
    callback();
  }))
  .pipe(gulp.dest('./cards'))
);
