const { schema, normalize } = require('normalizr');

/**
 * Tasks a string as input and return an object with a unique id in the form of
 * { id: Int, name: String (same as name param) }
 */
function createAuthorObj(name) {
  if (!this.authorCount) {
    this.authorCount = 0;
    this.authors = new Map();
  }
  let id = this.authors.get(name);
  if (typeof id === 'undefined') {
    id = this.authorCount;
    this.authorCount += 1;
    this.authors.set(name, id);
    return { id, name };
  }
  return { id, name };
}

/**
 * Takes a string category name as input and returns an object with a unique id in the form of
 * { id: String, name: String (same in category param) }
 */
function createCategoryObj(category) {
  return {
    id: category.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-(?=-)/g, '').toLowerCase(),
    name: category,
  };
}

exports.normalize = cards => {
  const mapped = cards.map(card => Object.assign({}, card, {
    authors: card.authors.map(createAuthorObj),
    categories: card.categories.map(createCategoryObj),
  }));
  const author = new schema.Entity('authors');
  const category = new schema.Entity('categories');
  const card = new schema.Entity('cards', {
    authors: [author],
    categories: [category],
  });
  return normalize(mapped, [card]);
};
