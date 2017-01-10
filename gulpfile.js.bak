/* eslint-disable no-use-before-define */
const gulp = require('gulp');
const del = require('del');
const stylus = require('gulp-stylus');
const autoprefixer = require('autoprefixer-stylus');
const { readdir, readFileSync, writeFile } = require('fs');
const frontmatter = require('front-matter');
const imagemin = require('gulp-imagemin');
const { normalize } = require('./server/utils/normalize.js');

// Utility tasks
gulp.task('clean', () => del(['dist/**/*', 'npm-debug.log', '!dist/index.html']));

// Cards
gulp.task('cards', () => (
  readdirPromise('./cards')
  .then(files => new Promise(res => {
    let cards = [];
    for (const file of files) { // eslint-disable-line
      const f = readFileSync(`./cards/${file}`, { encoding: 'utf8' });
      const parsed = frontmatter(f);
      const body = parsed.body.replace(/^#(?!#).+/m, ''); // remove titles from body
      cards = [...cards, buildCardObject(file, parsed.attributes, body)];
    }
    res(cards);
  }))
  .then(normalize)
  .then(json => writeFilePromise('./server/data.json',
    JSON.stringify(json).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
  ))
  .catch(err => console.error(err))
));

// Files
gulp.task('static', () => (
  gulp
    .src([
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
      use: [autoprefixer({ browsers: ['last 2 versions'] })],
      compress: true,
    }))
    .pipe(gulp.dest('dist'))
));

gulp.task('__build', gulp.series(
  'clean',
  gulp.parallel('cards', 'static', 'styles')
));


// Utility functions -------------------------------------------------------------------------------

function buildCardObject(filename, meta, contents) {
  return {
    title: meta.title,
    id: filename.slice(0, -3),
    drugs: (meta.drugs) ? meta.drugs.split(', ') : null,
    categories: meta.categories, //
    authors: meta.authors,
    created: +new Date(meta.created),
    updates: meta.updates ? meta.updates.map(u => +new Date(u)) : null,
    content: contents.toString(),
  };
}

function readdirPromise(path) {
  return new Promise((res, rej) => {
    readdir(path, (err, files) => {
      if (err) rej(err);
      res(files);
    });
  });
}

function writeFilePromise(path, content) {
  return new Promise((res, rej) => {
    writeFile(path, content, err => {
      if (err) rej(err);
      res();
    });
  });
}
