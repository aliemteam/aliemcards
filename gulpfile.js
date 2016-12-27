const gulp = require('gulp');
const debug = require('gulp-debug');
const through = require('through2');
const fm = require('gulp-front-matter');
const slug = require('slug');
const YAML = require('yamljs');
const sequence = require('run-sequence');
const fs = require('fs');
const FM = require('front-matter');

/**
 * Cards
 */

const buildCardObject = (filename, meta, contents) => (
  {
    title: meta.title,
    id: filename.slice(0, -3).toLowerCase(),
    drugs: (meta.drugs) ? meta.drugs.split(', ') : null,
    categories: meta.categories.map(cat => slug(cat, { lower: true })),
    authors: meta.authors,
    created: +new Date(meta.created),
    updates: meta.updates ? meta.updates.map(u => +new Date(u)) : null,
    content: contents.toString(),
  }
);

gulp.task('cards', () => (
  new Promise((res, rej) => {
    fs.readdir('./cards', (err, files) => {
      if (err) rej(err);
      res(files);
    });
  })
  .then(files => new Promise((res) => {
    const cards = [];
    for (const file of files) { // eslint-disable-line
      const f = fs.readFileSync(`./cards/${file}`, { encoding: 'utf8' });
      const parsed = FM(f);
      cards.push(buildCardObject(file, parsed.attributes, parsed.body));
    }
    res(cards);
  }))
  .then((cardObj) => {
    const json = JSON.stringify(cardObj).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    fs.writeFile('./app/server/data.js', `module.exports = ${json};`, (err) => {
      if (err) throw err;
      console.log('Done');
    });
  })
  .catch(err => console.error(err))
));

gulp.task('default', ['cards']);

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
      callback(null, file);
    }))
    .pipe(gulp.dest('./cards'))
));
