/* eslint-disable no-use-before-define */
const gulp = require('gulp');
const del = require('del');
const { readdir, readFileSync, writeFile } = require('fs');
const download = require('gulp-download');

// Utility tasks
gulp.task('clean', () => del(['cards-test/**/*']));

gulp.task('setup', () => (
  // make temp copy to test file manipulations
  gulp
    .src('./cards/**/*')
    .pipe(gulp.dest('./cards-image-fix'))
));

// Image fix
gulp.task('image-fix', () => (
  readdirPromise('./cards-image-fix')
  .then(files => new Promise(res => {
    const urls = [];
    let count = 0;
    for (const file of files) { // eslint-disable-line
      const filename = file.slice(0, -3);
      const content = readFileSync(`./cards/${file}`, { encoding: 'utf8' });
      const images = content.match(/(https?:\/\/.*\.(?:png|jpg))/gi);
      count = images != null ? count + images.length : count;
      urls[filename] = images;
    }
    res({ count, urls });
  }))
  .then(data => console.log(data.urls))
  .catch(err => console.error(err))
));

gulp.task('default', gulp.series(
  'clean',
  'setup',
  'image-fix'
));

// Utility functions

function readdirPromise(path) {
  return new Promise((res, rej) => {
    readdir(path, (err, files) => {
      if (err) rej(err);
      res(files.filter(file => file.indexOf('.md') > -1)); //get just .md files
    });
  });
}

function fiximagesPromise(content) {
  return new Promise((res, rej) => {
    const images = content.match(/(https?:\/\/.*\.(?:png|jpg))/gi);
  });
}
