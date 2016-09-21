var _ = require('lodash');
var gulp = require('gulp');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var tap = require('gulp-tap');
var through = require('through2');
var fm = require('gulp-front-matter');
var prettify = require('gulp-jsbeautifier');

// HELPER FUNCTIONS
// function to add to category or tag arrays
var addCardToSection = function(section, name, slug) {
  section[name] = (typeof section[name] != 'undefined' && section[name] instanceof Array) ? section[name] : [];
  section[name].push(slug);
}

// function to process categories and tags of each card
var buildSections = function(card, slug, cat_array, tag_array) {
  _.forEach(card.collection, function(cat){
    addCardToSection(cat_array, cat, slug);
  });
  _.forEach(card.tags, function(tag){
    addCardToSection(tag_array, tag, slug);
  });
}

// THE BUSINESS
gulp.task('default', function(){
  return gulp.src('../cards/*.md')
  .pipe(debug({title: 'unicorn:'}))
  // extract front matter and turn tags into array
  .pipe(fm({ property: 'meta' }))
  .pipe(tap(function(file, t){
    if (file.meta.tags) {
      file.meta.tags = file.meta.tags.split(', ');
    }
  }))
  // buffer all files into single stream
  .pipe(gutil.buffer())
  // build new stream with single json file with categories, tags, and cards
  .pipe(through.obj(function (files, enc, callback) {
    var categories = {};
    var tags = {};
    var cards = {};

    _.forEach(files, function(file){
      var card = file.meta;
      var slug = file.relative.split('.')[0] // filename minus .md extension
      card["slug"] = slug;
      card["content"] = file.contents.toString();
      buildSections(card, slug, categories, tags);
      cards[slug] = card;
    });

    var json = {};
    json['categories'] = categories;
    json['tags'] = tags;
    json['cards'] = cards;

    var file = new gutil.File({
      cwd: __dirname,
      base: __dirname,
      path: __dirname + '/content.json',
      contents: new Buffer(JSON.stringify(json))
    });

    this.push(file);
    callback();
  }))
  .pipe(gulp.dest('.'))
  // prettify, rename and resave
  .pipe(prettify())
  .pipe(tap(function(file,t){
    file.path = file.base + '/content-pretty.json';
  }))
  .pipe(gulp.dest('.'));
});
