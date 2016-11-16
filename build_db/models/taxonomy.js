const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxonomySchema = new Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String },
  cards: { type: Array },
});

const Category = mongoose.model('Category', taxonomySchema);
const Tag = mongoose.model('Tag', taxonomySchema);
const Drug = mongoose.model('Drug', taxonomySchema);

module.exports = {
  category: Category,
  tag: Tag,
  drug: Drug,
};
