import { normalize as normalizr, schema } from 'normalizr';
import { Context, SingleCardJSON } from '../schema';
import { Author, Category } from '../types/';

/**
 * Tasks a string as input and returns an object with a unique id in the form of
 * { id: Int, name: String (same as name param) }
 */
class AuthorFactory {
  public static create(name: string): Author {
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

export const normalize = (cards: SingleCardJSON[]): Context => {
  const mapped = cards.map(card => Object.assign({}, card, {
    authors: card.authors.map(AuthorFactory.create),
    categories: card.categories.map(createCategoryObj),
  }));
  // const mapped = cards.map(card => ({...card,
  //   authors: card.authors.map(AuthorFactory.create),
  //   categories: card.categories.map(createCategoryObj),
  // })); // FIXME: Issue with ts-node -- not accepting object spread
  const author = new schema.Entity('authors');
  const category = new schema.Entity('categories');
  const card = new schema.Entity('cards', {
    authors: [author],
    categories: [category],
  });
  return normalizr(mapped, [card]);
};
