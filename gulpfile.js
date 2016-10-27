const _ = require('lodash');
const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const tap = require('gulp-tap');
const through = require('through2');
const fm = require('gulp-front-matter');
const markdown = require('gulp-markdown');
const prettify = require('gulp-jsbeautifier');
const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

// ////////////////////////////////////
// HELPER FUNCTIONS
// ////////////////////////////////////

// function to add to category or tag arrays
const addCardToSection = function(section, name, card_slug, card_title) {
  section[name] = (section[name]) ? section[name] : [];
  section[name].push({
    slug: card_slug,
    title: card_title
  });
}

// function to process categories and tags of each card
var buildSections = function(card, slug, cat_array, tag_array) {
  _.forEach(card.collection, function(cat){
    addCardToSection(cat_array, cat, slug, card.title);
  });
  _.forEach(card.tags, function(tag){
    addCardToSection(tag_array, tag, slug, card.title);
  });
};

// function to build vinyl file object from JSON object
var buildFile = function(name, json) {
  var file = new gutil.File({
    cwd: __dirname,
    base: __dirname,
    path: __dirname + name,
    contents: new Buffer(JSON.stringify(json))
  });
  return file;
};

// function to compare
var sortByKey = function(toSort) {
  const sorted = {};
  Object.keys(toSort).sort().forEach((key) => {
    sorted[key] = toSort[key];
  });
  return sorted;
};

// ////////////////////////////////////
// COMPLETE_JSON BUILD
// ////////////////////////////////////

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

// ////////////////////////////////////
// HTML STATIC SITE build_html
// ////////////////////////////////////

gulp.task('build_html', function(){
  return gulp.src('./cards/*.md')
  .pipe(debug({title: 'build_html:'}))

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


// ////////////////////////////////////
// API STATIC SITE build_api
// ////////////////////////////////////

// Taxonomy - categories or tags
// each taxonomy contains headings populated with card objects corresponding to that section

function Taxonomy() {
  this.headings = [];

  /**
   * Slugify string
   * @param {string} text
   * @return {string}
   */
  this.slugify = (text) =>
    text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  this.sortByKey = function(toSort) {
    const sorted = {};
    Object.keys(toSort).sort().forEach((key) => {
      sorted[key] = toSort[key];
    });
    return sorted;
  };

  /**
   * Add card to heading, make new heading object if needed
   * @param {object} card
   * @param {string} heading
   * @return null
   */
  this.addCardToHeading = (card, heading) => {
    const slug = this.slugify(heading);
    if (!this.headings[slug]) {
      this.headings[slug] = { title: heading, slug: slug, cards: [] };
    }
    this.headings[slug].cards.push({ slug: card.slug, title: card.title });
    this.headings = this.sortByKey(this.headings);
  };

  /**
   * Add card to multiple headings
   * @param {object} card
   * @param {array} headings
   * @return null
   */
  this.addCardToHeadings = (card, headings) => {
    if (headings) headings.forEach((heading) => this.addCardToHeading(card, heading));
  };

  this.getHeadings = () => this.headings;
  this.getHeadingsJSON = () => JSON.stringify(this.headings);
}

// Gulp Task
gulp.task('build_api', () =>
  gulp.src('./cards/*.md')
  .pipe(debug({ title: 'build_api:' }))

  // extract frontmatter into meta property
  .pipe(fm({ property: 'meta', remove: true }))

  // turn tags into array
  // save content as JSON file with api format
  .pipe(through.obj(function (file, enc, callback) {
    const response = {};
    var splitTags = null;

    if (file.meta.tags) {
      splitTags = file.meta.tags.split(', ');
    }

    response.status = 'success';
    response.data = {
      title: file.meta.title,
      slug: file.relative.split('.')[0].toLowerCase(), // filename minus .md extension
      tags: splitTags,
      collection: file.meta.collection,
      content: marked(file.contents.toString()),
    };

    const refile = new gutil.File({
      cwd: __dirname,
      base: `${__dirname}/build_api`,
      path: `${__dirname}/build_api/${response.data.slug}.json`,
      contents: new Buffer(JSON.stringify(response)),
    });

    gutil.log(`File name: ${file.path}`);
    this.push(refile);
    callback();
  }))

  .pipe(gulp.dest('./build_api'))

  // buffer all files into single stream
  // file.meta objects preserved
  .pipe(gutil.buffer())

  // build json document with categories, tags, and cards
  // save categories, pass on json doc
  .pipe(through.obj(function (files, enc, callback) {
    const cards = [];
    const categories = new Taxonomy;
    const tags = new Taxonomy;

    _.forEach(files, (file) => {
      const fileParsed = JSON.parse(file.contents.toString());
      const card = fileParsed.data;
      cards.push({ slug: card.slug, title: card.title });
      categories.addCardToHeadings(card, card.collection);
      tags.addCardToHeadings(card, card.tags);
    });

    const json = {};
    json.categories = categories.getHeadingsJSON();
    json.tags = tags.getHeadingsJSON();
    json.cards = JSON.stringify(cards);

    const refile = new gutil.File({
      cwd: __dirname,
      base: __dirname,
      path: `${__dirname}/categories.json`,
      contents: new Buffer(json.categories),
    });
    refile.meta = json;
    this.push(refile);
    callback();
  }))
  .pipe(prettify())
  .pipe(gulp.dest('./build_api/sections/'))

  // save tags
  // pass on json doc
  .pipe(through.obj(function (file, enc, callback) {
    const newfile = new gutil.File({
      cwd: __dirname,
      base: __dirname,
      path: `${__dirname}/tags.json`,
      contents: new Buffer(file.meta.tags),
    });
    newfile.meta = file.meta;
    this.push(newfile);
    callback();
  }))
  .pipe(prettify())
  .pipe(gulp.dest('./build_api/sections/'))

  // save cards
  .pipe(through.obj(function (file, enc, callback) {
    const cardsArray = JSON.parse(file.meta.cards);
    cardsArray.sort((a, b) => {
      const nameA = a.title ? a.title.toUpperCase() : null; // ignore upper and lowercase
      const nameB = b.title ? b.title.toUpperCase() : null; // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    const newfile = new gutil.File({
      cwd: __dirname,
      base: __dirname,
      path: `${__dirname}/cards.json`,
      contents: new Buffer(JSON.stringify(cardsArray)),
    });
    this.push(newfile);
    callback();
  }))
  .pipe(prettify())
  .pipe(gulp.dest('./build_api/sections/'))
);
