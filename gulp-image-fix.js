/* eslint-disable no-use-before-define */
const gulp = require('gulp');
const gutil = require('gulp-util');
const del = require('del');
const { readdir, readFileSync, writeFile } = require('fs');
const through = require('through2');
const download = require('gulp-download');

// Utility tasks
gulp.task('clean', () => del(['cards-image-fix/**/*']));

gulp.task('setup', () => (
  // make temp copy to test file manipulations
  gulp
    .src('./cards/**/*')
    .pipe(gulp.dest('./cards-image-fix'))
));

// Image fix
gulp.task('image-fix', () => (
  gulp.src('./cards-image-fix/**.md')
  .pipe(through.obj((file, enc, callback) => {
    const filename = file.relative.slice(0, -3);
    let content = file.contents.toString();
    let images = content.match(/(https?:\/\/.*\.(?:png|jpg))/gi);

    gutil.log(gutil.colors.cyan(file.relative));

    if (images != null) {
      images = images.map((url, index) => ({
        file: `${filename}-${index}.png`,
        url,
      }));

      images.forEach(image => {
        gutil.log(image.file);
        content = content.replace(image.url, image.file);
      });
    }
    file.contents = new Buffer(content); // eslint-disable-line
    callback(null, file);
  }))
  .pipe(gulp.dest('./cards-image-fix'))
));

gulp.task('default', gulp.series(
  'clean',
  'setup',
  'image-fix'
));
