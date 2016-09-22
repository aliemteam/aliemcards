var _ = require('lodash');
var gulp = require('gulp');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var tap = require('gulp-tap');
var through = require('through2');
var fm = require('gulp-front-matter');
var markdown = require('gulp-markdown');
var prettify = require('gulp-jsbeautifier');

//////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////

// function to add to category or tag arrays
var addCardToSection = function(section, name, slug) {
  section[name] = (section[name]) ? section[name] : [];
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

// function to build vinyl file object from JSON object
var buildFile = function(name, json) {
  var file = new gutil.File({
    cwd: __dirname,
    base: __dirname,
    path: __dirname + name,
    contents: new Buffer(JSON.stringify(json))
  });
  return file;
}

//////////////////////////////////////
// COMPLETE_JSON BUILD
//////////////////////////////////////

gulp.task('complete_json', function(){
  return gulp.src('./cards/*.md')
  .pipe(debug({title: 'complete_json:'}))
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
  .pipe(gulp.dest('./build_json'))
  // prettify, rename and resave
  .pipe(prettify())
  .pipe(tap(function(file,t){
    file.path = file.base + '/content-pretty.json';
  }))
  .pipe(gulp.dest('./build_json'));
});

//////////////////////////////////////
// HTML STATIC SITE build_json
//////////////////////////////////////

gulp.task('static_html', function(){
  return gulp.src('./cards/*.md')
  .pipe(debug({title: 'static_html:'}))

  // extract frontmatter and turn tags into array
  // save content as HTML file
  .pipe(fm({ property: 'meta', remove: true }))
  .pipe(tap(function(file, t){
    if (file.meta.tags) {
      file.meta.tags = file.meta.tags.split(', ');
    }
  }))
  .pipe(markdown())
  .pipe(gulp.dest('./build_html'))

  // buffer all files into single stream
  // file.meta objects preserved
  .pipe(gutil.buffer())

  // build json document with categories, tags, and cards
  // save categories, pass on json doc
  .pipe(through.obj(function (files, enc, callback) {
    var cards = {};
    var categories = {};
    var tags = {};

    _.forEach(files, function(file){
      var slug = file.relative.split('.')[0] // filename minus .md extension
      var card = file.meta;
      card.slug = slug;
      cards[slug] = card;
      buildSections(card, slug, categories, tags);
    });

    var json = {};
    json['categories'] = categories;
    json['tags'] = tags;
    json['cards'] = cards;

    var file = new gutil.File({
      cwd: __dirname,
      base: __dirname,
      path: __dirname + '/categories.json',
      contents: new Buffer(JSON.stringify(json.categories)),
    });
    file.meta = json;
    this.push(file);
    callback();
  }))
  .pipe(prettify())
  .pipe(gulp.dest('./build_html/sections/'))

  // save tags
  // pass on json doc
  .pipe(through.obj(function (file, enc, callback) {
    var newfile = new gutil.File({
      cwd: __dirname,
      base: __dirname,
      path: __dirname + '/tags.json',
      contents: new Buffer(JSON.stringify(file.meta.tags))
    });
    newfile.meta = file.meta;
    this.push(newfile);
    callback();
  }))
  .pipe(prettify())
  .pipe(gulp.dest('./build_html/sections/'))

  // save cards
  .pipe(through.obj(function (file, enc, callback) {
    var newfile = new gutil.File({
      cwd: __dirname,
      base: __dirname,
      path: __dirname + '/cards.json',
      contents: new Buffer(JSON.stringify(file.meta.cards))
    });
    this.push(newfile);
    callback();
  }))
  .pipe(prettify())
  .pipe(gulp.dest('./build_html/sections/'))
});
