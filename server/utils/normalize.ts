import { normalize as normalizr, schema } from 'normalizr';
import { AuthorRaw, Category } from '../models/';
import { RootValue, SingleCardJSON } from './strongTypes';

/**
 * Tasks a string as input and returns an object with a unique id in the form of
 * { id: Int, name: String (same as name param) }
 */
class AuthorFactory {
  public static create(name: string): AuthorRaw {
    let id = AuthorFactory.authors.get(name);
    if (typeof id === 'undefined') {
      id = AuthorFactory.authorCount.toString();
      AuthorFactory.authorCount += 1;
      AuthorFactory.authors.set(name, id);
    }
    return { id, name };
  }
  private static authorCount: number = 0;
  private static authors: Map<string, string> = new Map();
}

/**
 * Takes a string category name as input and returns an object with a unique id in the form of
 * { id: String, name: String (same in category param) }
 */
function createCategoryObj(category: string): Category {
  return {
    id: category.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-(?=-)/g, '').toLowerCase(),
    name: category,
  };
}

export const normalize = (cards: SingleCardJSON[]): RootValue => {
  const mapped = cards.map(card => ({
    ...card,
    authors: card.authors.map(AuthorFactory.create),
    categories: card.categories.map(createCategoryObj),
  }))
  .sort((a, b) => {
    if (a.title < b.title) { return -1; }
    if (a.title > b.title) { return 1; }
    return 0;
  });
  const author = new schema.Entity('authors');
  const category = new schema.Entity('categories');
  const card = new schema.Entity('cards', {
    authors: [author],
    categories: [category],
  });
  return normalizr(mapped, [card]);
};
