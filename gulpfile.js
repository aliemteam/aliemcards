/* eslint-disable no-use-before-define */
const gulp = require('gulp');
const del = require('del');
const stylus = require('gulp-stylus');
const autoprefixer = require('autoprefixer-stylus');
const { readdir, readFileSync, writeFile, statSync } = require('fs');
const frontmatter = require('front-matter');
const imagemin = require('gulp-imagemin');
const { normalize } = require('./server/utils/normalize.js');

const cfurl = 'http://d249u3bk3sqm2p.cloudfront.net';

// Utility tasks
gulp.task('clean', () => del(['dist/**/*', 'npm-debug.log', '!dist/index.html']));

// Cards
gulp.task('cards', () => (
  readdirPromise('./cards')
  .then(files => files.filter(file => statSync(`./cards/${file}`).isDirectory()))
  .then(dirs => {
    let cards = [];
    for (const dir of dirs) { // eslint-disable-line
      const f = readFileSync(`./cards/${dir}/card.md`, { encoding: 'utf8' });
      const parsed = frontmatter(f);
      let body = parsed.body.replace(/^#(?!#).+/m, ''); // remove titles from body
      // prepend cloudfront urls and card directory to image references
      body = body.replace(/(\w*(?:-|_)*\w*\.(?:png|jpg|jpeg|gif))/gi, `${cfurl}/${dir}/$&`);
      cards = [...cards, buildCardObject(dir, parsed.attributes, body)];
    }
    return cards;
  })
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
    id: filename,
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
