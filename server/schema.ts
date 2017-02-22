import * as Fuse from 'fuse.js';

import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import {
  Author,
  authorType,
  cardType,
  Category,
  categoryType,
} from './types/';

export interface AuthorJSON {
  [authorId: string]: Author;
}

export interface CategoryJSON {
  [categoryId: string]: Category;
}

export interface SingleCardJSON {
  authors: Array<keyof AuthorJSON>;
  categories: Array<keyof CategoryJSON>;
  content: string;
  created: number;
  drugs: string[]|null;
  id: string;
  title: string;
  updates: number[]|null;
}

export interface CardJSON {
  [cardId: string]: SingleCardJSON;
};

export interface Context {
  entities: {
    authors: AuthorJSON;
    categories: CategoryJSON;
    cards: CardJSON;
  };
  result: Array<keyof CardJSON>;
};

export type RootContext = GraphQLObjectTypeConfig<any, Context>;

/**
 * Query Type Definition
 *
 *    type Query {
 *      authors(): [Author]
 *      author(id: String!): Author
 *      cards(category: String, drug: String): [Card]
 *      card(id: String!): Card
 *      categories(): [Category]
 *      recentlyAdded(n: Int): [Card]
 *      recentlyUpdated(n: Int): [Card]
 *      neverUpdated(n: Int): [Card]
 *      oldestUpdates(n: Int): [Card]
 *      search(input: String): [Card]
 *    }
 */
const queryType = new GraphQLObjectType(<RootContext>{
  name: 'Query',
  fields: () => ({
    authors: {
      type: new GraphQLList(authorType),
      resolve: (_root, _args, context) => Object.values(context.entities.authors),
    },
    author: {
      type: authorType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The id of the author of interest.',
        },
      },
      resolve: (_root, { id }, context) => context.entities.authors[id],
    },
    cards: {
      type: new GraphQLList(cardType),
      args: {
        category: {
          type: GraphQLString,
          description: '(optional) Return cards that contain this category.',
        },
        drug: {
          type: GraphQLString,
          description: '(optional) Return cards that contain this drug.',
        },
      },
      resolve: (_root, { category, drug }, context) => {
        const cards = Object.values(context.entities.cards);
        if (!category && !drug) { return cards; }
        if (!category && drug) {
          return cards.filter(c => c.drugs && c.drugs.indexOf(drug) !== -1);
        }
        if (category && !drug) {
          return cards.filter(c => c.categories.indexOf(category) !== -1);
        }
        return cards.filter(c => (
          (c.categories.indexOf(category) !== -1) && (c.drugs && c.drugs.indexOf(drug) !== -1)
        ));
      },
    },
    card: {
      type: cardType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Returns a single card that matches id.',
        },
      },
      resolve: (_root, { id }, context) => context.entities.cards[id],
    },
    categories: {
      type: new GraphQLList(categoryType),
      resolve: (_root, _args, context) => (
        Object.values(context.entities.categories)
        .sort((a, b) => {
          if (a.id < b.id) { return -1; }
          if (a.id > b.id) { return 1; }
          return 0;
        })
      ),
    },
    category: {
      type: categoryType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Returns a single category that matches id.',
        },
      },
      resolve: (_root, { id }, context) => context.entities.categories[id],
    },
    recentlyAdded: {
      type: new GraphQLList(cardType),
      args: {
        n: {
          type: GraphQLInt,
          description: '(Optional) Number of cards to return. Default 5.',
        },
      },
      resolve: (_root, { n }, context) => (
        Object.values(context.entities.cards).sort((a, b) => {
          if (a.created < b.created) { return 1; }
          if (a.created > b.created) { return -1; }
          return 0;
        })
        .slice(0, n || 5)
      ),
    },
    recentlyUpdated: {
      type: new GraphQLList(cardType),
      args: {
        n: {
          type: GraphQLInt,
          description: '(Optional) Number of cards to return. Default 5.',
        },
      },
      resolve: (_root, { n }, context) => (
        Object.values(context.entities.cards)
        .filter(card => card.updates)
        .sort((a, b) => {
          const lhs = a.updates === null ? 0 : a.updates[0];
          const rhs = b.updates === null ? 0 : b.updates[0];
          if (lhs < rhs) { return 1; }
          if (lhs > rhs) { return -1; }
          return 0;
        })
        .slice(0, n || 5)
      ),
    },
    neverUpdated: {
      type: new GraphQLList(cardType),
      args: {
        n: {
          type: GraphQLInt,
          description: '(Optional) Number of cards to return, Defaults to no limit',
        },
      },
      resolve: (_root, { n }, context) => {
        const cards = Object.values(context.entities.cards)
        .filter(card => !card.updates)
        .sort((a, b) => {
          if (a.created < b.created) { return -1; }
          if (a.created > b.created) { return 1; }
          return 0;
        });
        return n ? cards.slice(0, n) : cards;
      },
    },
    oldestUpdates: {
      type: new GraphQLList(cardType),
      args: {
        n: {
          type: GraphQLInt,
          description: '(Optional) Number of cards to return, Defaults to no limit',
        },
      },
      resolve: (_root, { n }, context) => {
        const cards = Object.values(context.entities.cards)
        .filter(card => card.updates)
        .sort((a, b) => {
          const lhs = a.updates === null ? 0 : a.updates[0];
          const rhs = b.updates === null ? 0 : b.updates[0];
          if (lhs < rhs) { return 1; }
          if (lhs > rhs) { return -1; }
          return 0;
        });
        return n ? cards.slice(0, n) : cards;
      },
    },
    search: {
      type: new GraphQLList(cardType),
      args: {
        input: {
          type: GraphQLString,
          description: 'A string used to find cards.',
        },
      },
      resolve: (_root, { input }, context) => {
        if (!input) { return []; }
        const fuse = new Fuse(Object.values(context.entities.cards), {
          caseSensitive: false,
          shouldSort: true,
          tokenize: true,
          threshold: 0.2,
          location: 0,
          distance: 0,
          maxPatternLength: 32,
          minMatchCharLength: 3,
          keys: [{ name: 'title', weight: 0.8 }, { name: 'content', weight: 0.2 }],
        });
        const result = fuse.search<SingleCardJSON>(input).slice(0, 8);
        return result.map(r => ({ id: r.id, title: r.title }));
      },
    },
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
});
