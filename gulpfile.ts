// tslint:disable:no-console
import * as autoprefixer from 'autoprefixer-stylus';
import { execFile } from 'child_process';
import * as del from 'del';
import * as frontmatter from 'front-matter';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as image from 'gulp-image';
import * as stylus from 'gulp-stylus';

import { normalize } from './server/utils/normalize';
import { SingleCardJSON } from './server/utils/strongTypes';

const CLOUDFRONT_URL = 'https://d249u3bk3sqm2p.cloudfront.net';
const REGEX = {
  hasTitle: new RegExp('^#(?!#).+', 'm'),
  hasReferenceHeading: new RegExp('## References'),
};

// Utility tasks
gulp.task('clean', () => del(['dist/**/*', 'npm-debug.log', '!dist/app/index.html']));

// Cards
gulp.task('cards', () => (
  readdirPromise('./cards')
    .then(checkDirectoryShape)
    .then(dirs => {
      let cards: SingleCardJSON[] = [];
      for (const dir of dirs) {
        const f = fs.readFileSync(`./cards/${dir}/card.md`, { encoding: 'utf8' });
        const parsed = frontmatter(f);

        // Does frontmatter exist?
        if (!parsed.frontmatter) {
          throw new Error(`Frontmatter not found for ${dir}`);
        }

        // Does the card have an H1 title?
        if (!REGEX.hasTitle.test(parsed.body)) {
          throw new Error(`H1 title not set for ${dir}`);
        }

        // Does the card have a reference header?
        if (!REGEX.hasReferenceHeading.test(parsed.body)) {
          throw new Error(`Improper reference format found in ${dir}`);
        }

        checkCardAttributes(parsed.attributes, dir);

        const body = parsed.body
          // remove titles from body
          .replace(/^#(?!#).+/m, '')
          // prepend cloudfront url and directory to images
          .replace(/(\w*(?:-|_)*\w*\.(?:png|jpg|jpeg|gif))/gi, `${CLOUDFRONT_URL}/${dir}/$&`);

        cards = [...cards, buildCardObject(dir, parsed.attributes, body)];
      }
      return cards;
    })
    .then(normalize)
    .then(json => writeFilePromise('./dist/server/data.json',
      JSON.stringify(json).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'),
    ))
));

// Files
gulp.task('typescript', cb => {
  execFile('./node_modules/.bin/tsc', ['-p', __dirname], (err, stdout, stderr) => {
    if (stderr) { console.error(stderr); }
    if (stdout) { console.log(stdout); }
    if (err) { throw err; }
    cb();
  });
});

gulp.task('static', () => (
  gulp
    .src([
      './app/assets/images/*',
      './app/assets/manifest.json',
    ], { base: './app' })
    .pipe(image({ pngquant: false }))
    .pipe(gulp.dest('./dist/app'))
));

gulp.task('styles', () => (
  gulp
    .src(['./app/assets/css/print.styl'], { base: './app' })
    .pipe(stylus({
      use: [autoprefixer({ browsers: ['last 2 versions'] })],
      compress: true,
    }))
    .pipe(gulp.dest('dist/app'))
));

gulp.task('__build', gulp.series(
  'clean',
  'typescript',
  gulp.parallel('cards', 'static', 'styles'),
));

// Utility functions -------------------------------------------------------------------------------

interface CardMeta {
  authors: string[];
  categories: string[];
  created: string;
  title: string;
  updates: string[] | null;
}

function buildCardObject(filename: string, meta: CardMeta, content: string): SingleCardJSON {
  return {
    title: meta.title,
    id: filename,
    categories: meta.categories,
    authors: meta.authors,
    created: +new Date(meta.created),
    updates: meta.updates ? meta.updates.map(u => +new Date(u)) : null,
    content,
  };
}

function readdirPromise(path): Promise<string[]> {
  return new Promise<string[]>((res, rej) => {
    fs.readdir(path, (err, files) => {
      if (err) { return rej(err); }
      res(files);
    });
  });
}

function writeFilePromise(path, content) {
  return new Promise((res, rej) => {
    fs.writeFile(path, content, err => {
      if (err) { rej(err); }
      res();
    });
  });
}

// Fail-fast abstractions --------------------------------------------------------------------------

function checkDirectoryShape(contents: string[]): Promise<string[]> {
  const promises: Array<Promise<string>> = [];
  for (const dir of contents) {
    promises.push(new Promise(res => {
      fs.stat(`./cards/${dir}`, (err, stats) => {
        if (err) { throw err; }
        if (!stats.isDirectory()) {
          throw new Error('No files should be located in the first level of the "cards" directory');
        }
        fs.readdir(`./cards/${dir}`, (errr, files) => {
          if (errr) { throw errr; }
          if (files.indexOf('card.md') === -1) {
            throw new Error(`No card.md file found in directory ${dir}`);
          }
          res(dir);
        });
      });
    }));
  }
  return Promise.all(promises);
}

function checkCardAttributes(attrs: Partial<CardMeta>, cardName: string): void {
  const keys = [
    'authors', 'categories', 'created', 'title', 'updates',
  ];
  const attributeKeys = Object.keys(attrs).filter(k => ['pubmed', 'googlescholar'].indexOf(k) === -1);

  if (attributeKeys.length < keys.length) {
    throw new Error(`${cardName} is missing yaml attributes`);
  }

  attributeKeys.forEach(att => {
    switch (att) {
      case 'authors':
      case 'categories':
        if (!Array.isArray(attrs[att])) {
          throw new Error(`Invalid "${att}" type in yaml of card ${cardName}`);
        }
        if ((<string[]>attrs[att]).length === 0) {
          throw new Error(`No ${att} listed for card ${cardName}`);
        }
        return;
      case 'created':
        if (typeof attrs[att] !== 'string' || attrs[att] === '' || !/\d{4}\/\d{2}\/\d{2}/.test(<string>attrs[att])) {
          throw new Error(`Invalid "${att}" property in yaml of ${cardName}`);
        }
        return;
      case 'title':
        if (typeof attrs[att] !== 'string' || attrs[att] === '') {
          throw new Error(`Invalid "${att}" property in yaml of ${cardName}`);
        }
        return;
      case 'updates':
        if (attrs[att] !== null && !Array.isArray(attrs[att])) {
          throw new Error(`Invalid "${att}" property in yaml of ${cardName}`);
        }
        return;
      default:
        throw new Error(`Invalid yaml attribute found in ${cardName}: ${att}`);
    }
  });
}
