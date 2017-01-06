/* eslint-disable no-use-before-define */
const gulp = require('gulp');
const gutil = require('gulp-util');
const del = require('del');
const through = require('through2');
const request = require('request');
const fs = require('fs');
const rename = require('gulp-rename');
const fm = require('gulp-front-matter');
const YAML = require('yamljs');

// Utility tasks
gulp.task('clean', () => del(['cards-image-fix/**/*', 'cards-reshape/**/*']));

gulp.task('setup', () => (
  // make temp copy to test file manipulations
  gulp
    .src('./cards/**/*')
    .pipe(gulp.dest('./cards-image-fix'))
));

// Separate out meta
gulp.task('new_yaml', () => (
  gulp.src('./cards-reshape/**/*.md')
  .pipe(fm({
    property: 'fm',
    remove: true,
  }))
  .pipe(gulp.dest('./cards-reshape'))
  .pipe(through.obj((file, enc, callback) => {
    file.contents = new Buffer(YAML.stringify(file.fm)); // eslint-disable-line
    callback(null, file);
  }))
  .pipe(rename(file => {
    file.basename = 'meta';
    file.extname = '.yaml';
  }))
  .pipe(gulp.dest('./cards-reshape'))
));

// Reshape data
gulp.task('reshape', () => (
  gulp.src('./cards-image-fix/**.md', { base: process.cwd() })
  .pipe(rename(file => {
    file.dirname = file.basename;
    file.basename = 'card';
    file.extname = '.md';
  }))
  .pipe(gulp.dest('./cards-reshape'))
  // .pipe(through.obj((file, enc, callback) => {
  //   gutil.log(file.relative.slice(0, -8));
  //   callback(null, file);
  // }))
  .pipe(through.obj((file, enc, callback) => {
    const slug = file.relative.slice(0, -8);
    let content = file.contents.toString();
    let images = content.match(/(https?:\/\/.*\.(?:png|jpg))/gi);

    gutil.log(gutil.colors.cyan(slug));

    if (images != null) {
      images = images.map((url, index) => ({
        file: `image-${index}.png`,
        url,
      }));
      images.forEach(image => {
        content = content.replace(image.url, image.file);
      });
      const promises = Promise.all(images.map(image => promiseRequest(image.url, `./cards-reshape/${slug}`, image.file)));
      file.contents = new Buffer(content); // eslint-disable-line
      promises.then(() => callback(null, file));
    } else {
      callback(null, file);
    }
  }))
  .pipe(gulp.dest('./cards-reshape'))
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
        content = content.replace(image.url, `images/${image.file}`);
      });
      const promises = Promise.all(images.map(image => promiseRequest(image.url, './cards-image-fix/images', image.file)));
      file.contents = new Buffer(content); // eslint-disable-line
      promises.then(() => callback(null, file));
    } else {
      callback(null, file);
    }
  }))
  .pipe(gulp.dest('./cards-image-fix'))
));

gulp.task('default', gulp.series(
  'clean',
  'setup',
  'image-fix'
));

gulp.task('__reshape', gulp.series(
  'clean',
  'setup',
  'reshape'
));

// Utility functions

function promiseRequest(url, path, name) {
  return new Promise((res, rej) => {
    request
      .get(url)
      .on('error', err => rej(err))
      .pipe(fs.createWriteStream(`${path}/${name}`))
      .on('finish', () => res('success'));
  });
}
