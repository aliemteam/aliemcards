// WORK IN PROGRESS

'use strict'; //eslint-disable-line

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const hashfile = require('../hash.json');

class Hasher {
  constructor(cardsPath, oldHashFile) {
    this.cardsPath = path.normalize(cardsPath);
    this.oldHash = oldHashFile;
    this.newHash = this.buildHash(this.cardsPath);
    this.oldCards = Object.keys(this.oldHash.cards);
    this.newCards = Object.keys(this.newHash.cards);
  }

  get hash() {
    return JSON.stringify(this.newHash, null, ' ');
  }

  /**
   * [checksum description]
   * @param  {[string | Buffer]}  x           [string or buffer to hash]
   * @param  {[string]}           algorithm   [hashing algorithm]
   * @param  {[string]}           encoding    [encoding type hash output]
   * @return {[string]}                       [hash]
   */
  checksum(x, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(x, 'utf8')
        .digest(encoding || 'hex');
  }

  /**
   * [hashCard description]
   * @param  {[string]} card  [card folder name]
   * @return {[array]}        [object for each file with filename and checksum]
   */
  hashCard(card) {
    const cardPath = `${card}`;
    const files = fs.readdirSync(cardPath).filter(x => x !== '.DS_Store');
    const cardhash = files.map(file => ({ file, hash: this.checksum(fs.readFileSync(`${cardPath}/${file}`)) }));
    return cardhash;
  }

  /**
   * [buildHash description]
   * @return {[object]}           [master hash object]
   */
  buildHash(cardsPath) {
    const masterhash = {
      timestamp: Date.now(),
      cards: {},
    };

    const cards = fs.readdirSync(cardsPath).filter(file => fs.statSync(`${cardsPath}/${file}`).isDirectory());
    cards.forEach(card => {
      const content = this.hashCard(`${cardsPath}/${card}`);
      const hash = this.checksum(JSON.stringify(content));
      masterhash.cards[card] = { hash, content };
    });

    return masterhash;
  }

  /**
   * [getHashDeletions description]
   * @return {[array]}         [array of folder names]
   */
  getHashDeletions() {
    return this.oldCards.filter(x => this.newCards.indexOf(x) === -1);
  }

  getHashAdditions() {
    return this.newCards.filter(x => this.oldCards.indexOf(x) === -1);
  }

  getHashCommons() {
    return this.oldCards.filter(x => this.newCards.indexOf(x) !== -1);
  }

}

const hashTest = new Hasher('../../cards-image-fix', hashfile);
console.log(hashTest.getHashCommons());
// fs.writeFileSync('../hash.json', JSON.stringify(hashTest, null, ' '));
