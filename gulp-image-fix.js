/* eslint-disable no-use-before-define */
const gulp = require('gulp');
const gutil = require('gulp-util');
const del = require('del');
const { createWriteStream } = require('fs');
const through = require('through2');
const rename = require('gulp-rename');
const request = require('request');

// Utility tasks
gulp.task('clean', () => del(['cards-image-fix/**/*']));

gulp.task('reshape', () => (
  gulp
    .src('./cards/**.md')
    .pipe(rename(path => {
      path.dirname = path.basename;
      path.basename = 'card';
    }))
    .pipe(gulp.dest('./cards-image-fix'))
));

// Image fix
gulp.task('image-fix', () => (
  gulp.src('./cards-image-fix/**/*.md')
  .pipe(through.obj((file, enc, callback) => {
    const id = file.relative.split('/').shift(); // directory name is card id
    let content = file.contents.toString();
    const images = content.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi);

    gutil.log(gutil.colors.cyan(id));

    if (images != null) {
      // replace urls with local filenames
      const downloads = images.map((url, index) => {
        const ext = url.split('.').pop();
        const filename = `image-${index + 1}.${ext}`;
        content = content.replace(url, filename);
        return ({ local: `./cards-image-fix/${id}/${filename}`, remote: url });
      });

      const promises = Promise.all(downloads.map(download =>
        downloadAndSave(download)
        .then(data => gutil.log(data))
      ));

      // downloads done, replace md contents, and pass on
      promises.then(() => {
        file.contents = new Buffer(content); // eslint-disable-line
        callback(null, file);
      })
      .catch(err => gutil.log(gutil.colors.magenta(err)));
    } else {
      // nothing to download, pass on md
      callback(null, file);
    }
  }))
  .pipe(gulp.dest('cards-image-fix'))
));

gulp.task('default', gulp.series(
  'clean',
  'reshape',
  'image-fix'
));

// Utilities

function downloadAndSave(thing) {
  return new Promise((res, rej) => {
    request(thing.remote)
      .pipe(createWriteStream(thing.local))
      .on('close', () => res(`saved ${thing.local}`));
  });
}
