const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxonomySchema = new Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String },
});

const Category = mongoose.model('Category', taxonomySchema);
const Tag = mongoose.model('Tag', taxonomySchema);

module.exports = {
  category: Category,
  tag: Tag,
};
