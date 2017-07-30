// tslint:disable:no-console
import * as autoprefixer from 'autoprefixer-stylus';
import { execFile } from 'child_process';
import * as del from 'del';
import * as frontmatter from 'front-matter';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as image from 'gulp-image';
import * as stylus from 'gulp-stylus';
import * as yaml from 'js-yaml';
import { promisify } from 'util';

const readdirPromise = promisify(fs.readdir);
const writeFilePromise = promisify(fs.writeFile);

import { normalize, SingleCardJSON } from './server/normalize';

const CLOUDFRONT_URL = 'https://d249u3bk3sqm2p.cloudfront.net';
const REGEX = {
  dateStringFormat: new RegExp(/^\d{4}\/\d{2}\/\d{2}$/),
  hasReferenceHeading: new RegExp(/## References/),
  imageUrl: new RegExp(/[\w-]+\.(?:png|jpg|jpeg|gif)/, 'gi'),
  imagesWithoutAltText: new RegExp(/\!\[\]\(image-\d{1,2}\.\w+\)/, 'gi'),
  markdownH1: new RegExp(/^#(?!#).+/, 'm'),
};

// Utility tasks
gulp.task('clean', () => del(['dist/**/*', 'npm-debug.log', '!dist/app/index.html']));

// Cards
gulp.task('cards', () =>
  readdirPromise('./cards')
    .then(checkDirectoryShape)
    .then(dirs => {
      let cards: SingleCardJSON[] = [];
      for (const dir of dirs) {
        const f = fs.readFileSync(`./cards/${dir}/card.md`, {
          encoding: 'utf8',
        });
        let parsed;
        try {
          parsed = frontmatter(f);
        } catch (e) {
          console.error(`Error in yaml of ${dir}`);
          throw e;
        }

        // Does frontmatter exist?
        if (!parsed.frontmatter) {
          throw new Error(`Frontmatter not found for ${dir}`);
        }

        // Does the card have an H1 title?
        if (!REGEX.markdownH1.test(parsed.body)) {
          throw new Error(`H1 title not set for ${dir}`);
        }

        // Does the card have a reference header?
        if (!REGEX.hasReferenceHeading.test(parsed.body)) {
          throw new Error(`Improper reference format found in ${dir}`);
        }

        if (REGEX.imagesWithoutAltText.test(parsed.body)) {
          console.warn(
            `\x1b[33m\x1b[1mWarning:\x1b[0m One or more images in \x1b[32m${dir}\x1b[0m do not have alt text`,
          );
        }

        checkCardAttributes(parsed.attributes, dir);

        const body = parsed.body
          // remove titles from body
          .replace(REGEX.markdownH1, '')
          // prepend cloudfront url and directory to images
          .replace(REGEX.imageUrl, `${CLOUDFRONT_URL}/${dir}/$&`);

        cards = [...cards, buildCardObject(dir, parsed.attributes, body)];
      }
      return cards;
    })
    .then(sitemap)
    .then(normalize)
    .then(json => {
      const announcements = yaml.safeLoad(fs.readFileSync('./cards/announcements.yml', 'utf8'));
      const data = { announcements, ...json };
      return writeFilePromise(
        './dist/server/data.json',
        JSON.stringify(data).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'),
      );
    }),
);

// Files
gulp.task('typescript', cb => {
  execFile('./node_modules/.bin/tsc', ['-p', __dirname], (err, stdout, stderr) => {
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
    if (err) {
      throw err;
    }
    cb();
  });
});

gulp.task('static', () =>
  gulp
    .src(['./app/assets/images/*', './app/assets/manifest.json'], {
      base: './app',
    })
    .pipe(image({ pngquant: false }))
    .pipe(gulp.dest('./dist/app')),
);

gulp.task('styles', () =>
  gulp
    .src(['./app/assets/css/print.styl'], { base: './app' })
    .pipe(
      stylus({
        use: [autoprefixer({ browsers: ['last 2 versions'] })],
        compress: true,
      }),
    )
    .pipe(gulp.dest('dist/app')),
);

gulp.task(
  '__build',
  gulp.series('clean', 'typescript', gulp.parallel('cards', 'static', 'styles')),
);

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

function sitemap(cards: SingleCardJSON[]): SingleCardJSON[] {
  const baseurl = 'https://www.aliemcards.com';
  const sm = [
    baseurl,
    `${baseurl}/about`,
    `${baseurl}/cards`,
    `${baseurl}/categories`,
    ...cards.map(card => `${baseurl}/cards/${card.id}`),
  ].join('\n');
  if (!fs.existsSync('./dist/app')) {
    fs.mkdirSync('./dist/app');
  }
  writeFilePromise('./dist/app/sitemap.txt', sm);
  return cards;
}

// Fail-fast abstractions --------------------------------------------------------------------------

function checkDirectoryShape(contents: string[]): Promise<string[]> {
  const ignoredFiles = ['.DS_Store', 'announcements.yml'];
  const promises: Array<Promise<string>> = [];
  for (const dir of contents) {
    if (ignoredFiles.indexOf(dir) !== -1) {
      continue;
    }
    promises.push(
      new Promise(res => {
        fs.stat(`./cards/${dir}`, (err, stats) => {
          if (err) {
            throw err;
          }
          if (!stats.isDirectory()) {
            throw new Error(
              'No files should be located in the first level of the "cards" directory',
            );
          }
          fs.readdir(`./cards/${dir}`, (errr, files) => {
            if (errr) {
              throw errr;
            }
            if (files.indexOf('card.md') === -1) {
              throw new Error(`No card.md file found in directory ${dir}`);
            }
            res(dir);
          });
        });
      }),
    );
  }
  return Promise.all(promises);
}

function checkCardAttributes(attrs: Partial<CardMeta>, cardName: string): void {
  const keys = ['authors', 'categories', 'created', 'title', 'updates'];
  const attributeKeys = Object.keys(attrs);

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
        if (
          typeof attrs[att] !== 'string' ||
          attrs[att] === '' ||
          !REGEX.dateStringFormat.test(<string>attrs[att])
        ) {
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
