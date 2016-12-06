const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const through = require('through2');
const fm = require('gulp-front-matter');
const marked = require('marked');
const slug = require('slug');
const YAML = require('yamljs');
const sequence = require('run-sequence');
const mongoose = require('mongoose');
const { Card, Category } = require('./app/server/models/');

process.exit(0);

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

/**
 * Cards
 */

const buildCardObject = (filename, meta, contents) => (
  {
    title: meta.title,
    slug: filename.split('.')[0].toLowerCase(),
    drugs: (meta.drugs) ? meta.drugs.split(', ') : null,
    categories: meta.categories.map(cat => slug(cat, { lower: true })),
    authors: meta.authors,
    created: meta.created,
    updates: meta.updates,
    content: marked(contents.toString()),
  }
);

// make new Card documents based on directory of markdown files
// wrap in Promise to control async operations
const cardsToMongo = glob => (
  new Promise((resolve, reject) => {
    gulp.src(glob)
    .pipe(fm({ property: 'meta', remove: true }))
    .pipe(through.obj((file, enc, done) => {
      const card = new Card(buildCardObject(file.relative, file.meta, file.contents));
      this.push(card);
      card.save().then(() => done());
    }))
    // through2 has to send stream somewhere in order to emit 'end' event
    // github.com/rvagg/through2/issues/31
    .on('data', card => gutil.log(gutil.colors.green(`Saved ${card.title}`)))
    .on('end', resolve)
    .on('error', reject);
  })
);

gulp.task('cards', () => {
  mongoose.connect(process.env.MLAB_CONNECT_STRING);
  return Card.find()
    .remove({}) // empty Card collection
    .exec()
    .then(() => cardsToMongo('./cards/*.md'))
    .then(() => mongoose.connection.close())
    .catch(err => gutil.log(gutil.colors.magenta(err)));
});

/**
 * Categories
 */

const buildUniqueCatArray = (files) => {
  const categories = [];

  files.forEach((file) => {
    const filecats = file.meta.categories;
    const cardSlug = file.relative.split('.')[0].toLowerCase();

    // only add categories to running array if they are unique
    filecats.forEach((cat) => {
      const catSlug = slug(cat, { lower: true });
      const foundCat = categories.find(e => e.slug === catSlug);
      if (foundCat) {
        foundCat.cards.push(cardSlug);
      } else {
        categories.push({ title: cat, slug: catSlug, cards: [cardSlug] });
      }
    });
  });

  return categories;
};

const saveCat = cat => (
  new Category(cat)
    .save()
    .then(saved => gutil.log(gutil.colors.blue(`Category ${saved.title}`)))
);

const categoriesToMongo = glob => (
  new Promise((resolve, reject) => {
    gulp.src(glob)
    .pipe(fm({ property: 'meta', remove: true })) // get frontmatter
    .pipe(gutil.buffer()) // buffer all cards into single array
    .pipe(through.obj((files, enc, done) => {
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
  })
);

gulp.task('cats', () => {
  mongoose.connect(process.env.MLAB_CONNECT_STRING);
  return Category.find()
    .remove({}) // empty Category collection
    .exec()
    .then(() => categoriesToMongo('./cards/*.md'))
    .then(() => mongoose.connection.close())
    .catch(err => gutil.log(gutil.colors.magenta(err)));
});

gulp.task('default', callback => sequence('cards', 'cats', callback));

/**
 * `new_yaml`: Utility function to modify cards
 */
gulp.task('new_yaml', () => (
  gulp.src('./oldcards/*.md')
    .pipe(debug({ title: 'build_db:' }))
    .pipe(fm({ property: 'meta', remove: true }))
    .pipe(through.obj((file, enc, callback) => {
      // const title = file.meta.title;
      // const categories = file.meta.categories;
      // const drugs = file.meta.drugs;
      // const authors = file.meta.authors;
      const { title, categories, drugs, authors } = file.meta;
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

      const rebuildString = `${fmblock}${YAML.stringify(frontmatter)}\n${fmblock}${content}`;
      file.contents = new Buffer(rebuildString); // eslint-disable-line
      this.push(file);
      callback();
    }))
    .pipe(gulp.dest('./cards'))
));
