const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: String,
  authors: Array,
  created: Date,
  updates: Array,
  categories: Array,
  drugs: Array,
  content: String,
  hash: String,
});

module.exports = mongoose.model('Card', cardSchema);
