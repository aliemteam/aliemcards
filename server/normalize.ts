import { normalize as normalizr, schema } from 'normalizr';

interface BaseObject {
  id: string;
  name: string;
}

interface Announcement {
  /** Date string in the form of YYYY/MM/DD */
  date: string;
  /** Heading for announcement */
  heading: string;
  /** Announcement message */
  message: string;
}

interface AuthorJSON {
  [authorId: string]: BaseObject;
}

interface CategoryJSON {
  [categoryId: string]: BaseObject;
}

export interface SingleCardJSON {
  authors: Array<keyof AuthorJSON>;
  categories: Array<keyof CategoryJSON>;
  content: string;
  created: number;
  id: string;
  title: string;
  updates: number[] | null;
}

interface CardJSON {
  [cardId: string]: SingleCardJSON;
}

/**
 * The complete shape of `data.json`
 */
export interface RootValue {
  announcements: Announcement[];
  entities: {
    authors: AuthorJSON;
    categories: CategoryJSON;
    cards: CardJSON;
  };
  result: Array<keyof CardJSON>;
}

export interface Context {
  data: RootValue;
}

/**
 * Tasks a string as input and returns an object with a unique id in the form of
 * { id: Int, name: String (same as name param) }
 */
class AuthorFactory {
  public static create(name: string): BaseObject {
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
function createCategoryObj(category: string): BaseObject {
  return {
    id: category.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-(?=-)/g, '').toLowerCase(),
    name: category,
  };
}

type AllButAnnouncements = Pick<RootValue, 'entities' | 'result'>;

export const normalize = (cards: SingleCardJSON[]): AllButAnnouncements => {
  const mapped = cards
    .map(c => ({
      ...c,
      authors: c.authors.map(AuthorFactory.create),
      categories: c.categories.map(createCategoryObj),
    }))
    .sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
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
