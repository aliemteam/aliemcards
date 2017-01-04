/* eslint-disable no-use-before-define */
const gulp = require('gulp');
const del = require('del');
const stylus = require('gulp-stylus');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');
const { readdir, readFileSync, writeFile } = require('fs');
const frontmatter = require('front-matter');
const imagemin = require('gulp-imagemin');
const { exec } = require('child_process');


// Utility tasks
gulp.task('clean', () => del(['dist/**/*', 'npm-debug.log', '!dist/index.html']));

// Cards
gulp.task('cards', () => (
  readdirPromise('./cards')
  .then(files => new Promise(res => {
    let cards = [];
    let categories = new Set();
    for (const file of files) { // eslint-disable-line
      const f = readFileSync(`./cards/${file}`, { encoding: 'utf8' });
      const parsed = frontmatter(f);
      const body = parsed.body.replace(/^#(?!#).+/m, ''); // remove titles from body
      categories = new Set([...categories, ...parsed.attributes.categories]);
      cards = [...cards, buildCardObject(file, parsed.attributes, body)];
    }
    categories = [...categories].map(category => ({
      id: createCategoryId(category),
      name: category,
    }));
    res({ cards, categories });
  }))
  .then(data => {
    const cardJson = JSON.stringify(data.cards).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    const categoryJson = JSON.stringify(data.categories).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    return execPromise('mkdir -p ./server/data')
    .then(writeFilePromise('./server/data/cards.js', `module.exports = ${cardJson};`))
    .then(writeFilePromise('./server/data/categories.js', `module.exports = ${categoryJson};`))
    .then(writeFilePromise('./server/data/index.js',
    'module.exports = {\n  cards: require(\'./cards.js\'),\n  categories: require(\'./categories.js\'),\n};\n'
    ));
  })
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
      use: [poststylus([autoprefixer({ browsers: ['last 2 versions'] })])],
      compress: true,
    }))
    .pipe(gulp.dest('dist'))
));

gulp.task('__build', gulp.series(
  'clean',
  gulp.parallel('cards', 'static', 'styles')
));


// Utility functions
function createCategoryId(category) {
  return category.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-(?=-)/g, '').toLowerCase();
}

function buildCardObject(filename, meta, contents) {
  return {
    title: meta.title,
    id: filename.slice(0, -3),
    drugs: (meta.drugs) ? meta.drugs.split(', ') : null,
    categories: meta.categories.map(createCategoryId),
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

function execPromise(cmd) {
  return new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) rej(err);
      res({ stdout, stderr });
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
