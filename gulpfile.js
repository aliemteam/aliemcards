const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const through = require('through2');
const fm = require('gulp-front-matter');
const marked = require('marked');
const crypto = require('crypto');
const slug = require('slug');
const YAML = require('yamljs');

// Get environemental variables
require('dotenv').config();
const mongoose = require('mongoose');
const Card = require('./build_db/models/card');
const Drug = require('./build_db/models/taxonomy').drug;
const Category = require('./build_db/models/taxonomy').category;

mongoose.connect(process.env.MLAB_URI);

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

gulp.task('build_cards', () => {
  // empty Card collection
  Card.find()
  .remove({})
  .exec()
  .catch((err) => { gutil.log(gutil.colors.magenta(err)); });

  // start Gulp file handling
  return gulp.src('./cards/*.md')
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
    const card = new Card({
      title: file.meta.title,
      slug: file.relative.split('.')[0].toLowerCase(), // filename minus .md extension
      drugs: (file.meta.drugs) ? file.meta.drugs.split(', ') : null,
      categories: file.meta.categories.map((cat) => slug(cat, { lower: true })),
      authors: file.meta.authors,
      created: file.meta.created,
      updates: file.meta.updates,
      content: marked(file.contents.toString()),
      hash: file.hash,
    });

    card.save()
    .then((saved) => gutil.log(gutil.colors.green(`Saved ${saved.title}`)))
    .catch((err) => gutil.log(gutil.colors.magenta(err)));

    callback();
  }));
});

// ///////////////////////////////////////////////
// build_cats
// ///////////////////////////////////////////////

gulp.task('build_cats', () => {
  // delete existing to update with current data
  Category.find()
  .remove({})
  .exec()
  .catch((err) => { gutil.log(gutil.colors.magenta(err)); });

  // start Gulp file handling
  return gulp.src('./cards/*.md')

  // extract frontmatter into meta property
  .pipe(fm({ property: 'meta', remove: true }))

  // buffer all cards into one array
  .pipe(gutil.buffer())
  .pipe(through.obj((files, enc, callback) => {
    // create master array of categories
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

    // save to dbase
    categories.forEach((cat) => {
      const newCat = new Category(cat);
      newCat.save().then((saved) => gutil.log(gutil.colors.blue(`Category ${saved.title}`)))
      .catch((err) => gutil.log(gutil.colors.magenta(err)));
    });
    callback();
  }));
});

// ////////////////////////////////////
// MLAB DATABASE BUILD build_db
// gulp build_db
// ////////////////////////////////////

gulp.task('build_db', ['build_cards', 'build_cats'], () => {
  // ??? Not sure when to close connection!
  // Can't figure out how to wait for promises from prior task to resovle
  // mongoose.connection.close();
});

// ///////////////////////////////////////////////
// Convert YAML
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
