const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taxonomySchema = new Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String },
  cards: { type: Array },
});

exports.Category = mongoose.model('Category', taxonomySchema);
exports.Drug = mongoose.model('Drug', taxonomySchema);
exports.Tag = mongoose.model('Tag', taxonomySchema);
