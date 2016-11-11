const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  title: String,
  slug: { type: String, required: true, unique: true, index: true },
  tags: Array,
  categories: Array,
  content: String,
  hash: String,
  updated: Array,
  authors: Array,
});

module.exports = mongoose.model('Card', cardSchema);
