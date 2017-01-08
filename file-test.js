const { readdir, statSync, readFileSync, writeFile } = require('fs');

function readdirPromise(path) {
  return new Promise((res, rej) => {
    readdir(path, (err, files) => {
      if (err) rej(err);
      res(files);
    });
  });
}

readdirPromise('./cards-reshape')
  .then(files => files.filter(file => statSync(`./cards-reshape/${file}`).isDirectory()))
  .then(dirs => console.log(dirs));
