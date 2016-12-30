const gulp = require('gulp');
const del = require('del');
const stylus = require('gulp-stylus');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');
const slug = require('slug');
const fs = require('fs');
const frontmatter = require('front-matter');
const imagemin = require('gulp-imagemin');


// Utility tasks
gulp.task('clean', () => del(['dist/**/*', 'npm-debug.log', '!dist/index.html']));

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
      const parsed = frontmatter(f);
      cards.push(buildCardObject(file, parsed.attributes, parsed.body));
    }
    res(cards);
  }))
  .then((cardObj) => {
    const json = JSON.stringify(cardObj).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    fs.writeFile('./server/data.js', `module.exports = ${json};`, (err) => {
      if (err) throw err;
    });
  })
  .catch(err => console.error(err))
));

gulp.task('static', () => (
  gulp
    .src([
      // './app/index.html',
      './app/assets/images/*',
      './app/assets/manifest.json',
    ], { base: './app' })
    .pipe(imagemin())
    .pipe(gulp.dest('./dist'))
));

gulp.task('styles', () => (
  gulp
    .src(['./app/assets/css/print.styl'], { base: './app' })
    .pipe(stylus({
      use: [poststylus([autoprefixer({ browsers: ['last 2 versions'] })])],
      compress: true,
    }))
    .pipe(gulp.dest('dist'))
));

gulp.task('__build', gulp.series(
  'clean',
  gulp.parallel('cards', 'static', 'styles')
));
