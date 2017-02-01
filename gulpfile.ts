import * as autoprefixer from 'autoprefixer-stylus';
import { execFile } from 'child_process';
import * as del from 'del';
import * as frontmatter from 'front-matter';
import { readdir, readFileSync, statSync, writeFile } from 'fs';
import * as gulp from 'gulp';
import * as image from 'gulp-image';
import * as stylus from 'gulp-stylus';

import { SingleCardJSON } from './server/schema';
import { normalize } from './server/utils/normalize';

const CLOUDFRONT_URL = 'https://d249u3bk3sqm2p.cloudfront.net';

// Utility tasks
gulp.task('clean', () => del(['dist/**/*', 'npm-debug.log', '!dist/app/index.html']));

// Cards
gulp.task('cards', () => (
  readdirPromise('./cards')
  .then(files => files.filter(file => statSync(`./cards/${file}`).isDirectory()))
  .then(dirs => {
    let cards: any[] = [];
    for (const dir of dirs) {
      const f = readFileSync(`./cards/${dir}/card.md`, { encoding: 'utf8' });
      const parsed = frontmatter(f);
      let body = parsed.body.replace(/^#(?!#).+/m, ''); // remove titles from body
      // prepend cloudfront urls and card directory to image references
      body = body.replace(/(\w*(?:-|_)*\w*\.(?:png|jpg|jpeg|gif))/gi, `${CLOUDFRONT_URL}/${dir}/$&`);
      cards = [...cards, buildCardObject(dir, parsed.attributes, body)];
    }
    return cards;
  })
  .then(normalize)
  .then(json => writeFilePromise('./dist/server/data.json',
    JSON.stringify(json).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'),
  ))
  .catch(err => console.error(err))
));

// Files
gulp.task('typescript', cb => {
  execFile('./node_modules/.bin/tsc', ['-p', __dirname], (err, stdout, stderr) => {
    if (stderr) { console.error(stderr); }
    if (stdout) { console.log(stdout); } // tslint:disable-line
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
  drugs: string|null; // FIXME: This should be an array
  title: string;
  updates: string[]|null;
}

function buildCardObject(filename: string, meta: CardMeta, content: string): SingleCardJSON {
  return {
    title: meta.title,
    id: filename,
    drugs: (meta.drugs) ? meta.drugs.split(', ') : null,
    categories: meta.categories,
    authors: meta.authors,
    created: +new Date(meta.created),
    updates: meta.updates ? meta.updates.map(u => +new Date(u)) : null,
    content,
  };
}

function readdirPromise(path) {
  return new Promise<string[]>((res, rej) => {
    readdir(path, (err, files) => {
      if (err) { rej(err); }
      res(files);
    });
  });
}

function writeFilePromise(path, content) {
  return new Promise((res, rej) => {
    writeFile(path, content, err => {
      if (err) { rej(err); }
      res();
    });
  });
}
