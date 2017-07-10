import * as Fuse from 'fuse.js';
import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { ArgumentField } from '../../utils/strongTypes';
import sortType, { AscOrDesc } from '../misc/sortType';
import cardType, { CardOrderBy, cardOrderByType } from './cardType';

interface CardsArgs {
  /** Return cards that contain this category. */
  category: string;
  /** Limit the response to n items. */
  limit: number;
  /** Order results by a specific field. */
  orderBy: CardOrderBy;
  /** Sort ascending or descending. */
  sort: AscOrDesc;
}

const cards: ArgumentField<CardsArgs> = {
  type: new GraphQLList(cardType),
  description: 'Fetch a list of cards.',
  args: {
    category: {
      description: 'Return cards that contain this category.',
      type: GraphQLString,
    },
    limit: {
      description: 'Limit the response to n items.',
      type: GraphQLInt,
    },
    orderBy: {
      description: 'Order results by a specific field.',
      type: cardOrderByType,
    },
    sort: {
      description: 'Sort order of the cards.',
      type: sortType,
      defaultValue: 'desc',
    },
  },
  resolve: (root, { category, limit, orderBy, sort }: CardsArgs) => {
    let payload = Object.values(root.entities.cards);

    if (category) {
      payload = payload.filter(c => c.categories.indexOf(category) !== -1);
    }

    switch (orderBy) {
      case 'created':
        payload = payload.sort((a, b) => {
          if (a.created < b.created) {
            return 1;
          }
          if (a.created > b.created) {
            return -1;
          }
          return 0;
        });
        break;
      case 'updated':
        payload = payload.filter(c => c.updates).sort((a, b) => {
          const lhs = a.updates === null ? 0 : a.updates[0];
          const rhs = b.updates === null ? 0 : b.updates[0];
          if (lhs < rhs) {
            return 1;
          }
          if (lhs > rhs) {
            return -1;
          }
          return 0;
        });
        break;
      default:
        break;
    }

    if (sort === 'asc') {
      payload = payload.slice().reverse();
    }

    if (limit) {
      payload = payload.slice(0, limit);
    }

    return payload;
  },
};

interface CardArgs {
  id: string;
}

const card: ArgumentField<CardArgs> = {
  type: cardType,
  description: 'Fetch a single card.',
  args: {
    id: {
      description: 'The ID of the card being queried.',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (root, { id }: CardArgs) => root.entities.cards[id],
};

interface SearchArgs {
  input: string;
}

const search: ArgumentField<SearchArgs> = {
  type: new GraphQLList(cardType),
  description: 'Fetch cards matching an input query.',
  args: {
    input: {
      description: 'The query string.',
      type: GraphQLString,
      defaultValue: '',
    },
  },
  resolve: (root, { input }) => {
    if (!input) {
      return [];
    }
    const fuse = new Fuse(Object.values(root.entities.cards), {
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
    const result = fuse.search<any>(input).slice(0, 8);
    return result.map(r => ({ id: r.id, title: r.title }));
  },
};

export default {
  cards,
  card,
  search,
};
