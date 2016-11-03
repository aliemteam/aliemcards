const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  title: String,
  slug: { type: String, required: true, unique: true, index: true },
  tags: Array,
  categories: Array,
  content: String,
  hash: String,
  createdAt: Date,
  updatedAt: Date,
});

cardSchema.pre('save', (next) => {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.created_at) this.createdAt = currentDate;
  next();
});

module.exports = mongoose.model('Card', cardSchema);
