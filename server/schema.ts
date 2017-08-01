import axios from 'axios';
import * as Fuse from 'fuse.js';
import { makeExecutableSchema } from 'graphql-tools';

// TODO: Split resolvers into another testable file

export interface APIResponse {
  status: number;
  statusText: string;
}

export interface Announcement {
  date: string;
  heading: string;
  message: string;
}

export interface Author {
  id: string;
  name: string;
  cards: Card[];
}

export interface Card {
  id: string;
  authors: Author[];
  categories: Category[];
  content: string;
  created: number;
  title: string;
  updates: number[] | null;
}

export interface Category {
  id: string;
  name: string;
}

export enum OrderBy {
  created = 'created',
  updated = 'updated',
}

export enum Sort {
  asc = 'asc',
  desc = 'desc',
}

const typeDefs = `

  # Generic response received from API calls
  type APIResponse {
    # Status code from API
    status: Int!
    # Status text from API
    statusText: String
  }

  # Data representing a single announcement
  type Announcement {
    # Date string in the form of YYYY/MM/DD
    date: String
    # Heading for announcement
    heading: String
    # Announcement message
    message: String
  }

  # A person who wrote or contributed to a card
  type Author {
    # The ID of the author
    id: String!
    # The name of the author
    name: String
    # A list of cards that the author contributed to
    cards: [Card]
  }

  # Data representing a single card
  type Card {
    # The ID of the card
    id: String!
    # List of authors
    authors: [Author]
    # List of categories
    categories: [Category]
    # Markdown string of the card's content
    content: String
    # UNIX timestamp of the original card creation date
    created: Float
    # The title of the card
    title: String
    # List of UNIX timestamps of each time the card was updated
    updates: [Float]
  }

  # Data representing a single category
  type Category {
    # The ID of the category
    id: String!
    # The category name
    name: String
  }

  # Order cards by a specific field
  enum OrderBy {
    created
    updated
  }

  # Sort direction of results
  enum Sort {
    asc
    desc
  }

  type Query {
    # Fetch a list of announcements
    announcements(
      # Limit the response to n items
      limit: Int,
      # Sort order of the announcements
      sort: Sort
    ): [Announcement]

    # Fetch a list of authors
    authors: [Author]

    # Fetch a single author
    author(
      # The ID of the author of interest
      id: String!
    ): Author

    # Fetch a list of cards
    cards(
      # Return cards that contain this category
      category: String,
      # Limit the response to n items
      limit: Int,
      # Order results by a specific field
      orderBy: OrderBy,
      # Sort order of the cards
      sort: Sort
    ): [Card]

    # Fetch a single card
    card(
      # The ID of the card being queried
      id: String!
    ): Card

    # Fetch a list of categories
    categories: [Category]

    # Fetch a single category
    category(
      # The ID of the category of interest
      id: String!
    ): Category

    # Fetch cards matching an input query
    search(
      # The query string
      input: String
    ): [Card]
  }

  type Mutation {
    # Send a message to the ALiEMCards slack channel
    contactUs(
      # Email address of person contacting
      email: String!,
      # Message from person contacting
      message: String!,
      # Name of the person contacting
      name: String!
    ): APIResponse
  }

`;

const resolvers = {
  Author: {
    cards: (author, _, context) =>
      Object.values(context.data.entities.cards).filter(c => c.authors.indexOf(author.id) !== -1),
  },
  Card: {
    authors: (card, _args, context) => card.authors.map(id => context.data.entities.authors[id]),
    categories: (card, _args, context) =>
      card.categories.map(id => context.data.entities.categories[id]),
  },
  Query: {
    announcements: (root, { limit, sort }) => {
      const payload = sort === 'desc' ? [...root.announcements] : [...root.announcements].reverse();
      return payload.slice(0, limit);
    },
    authors: root => Object.values(root.entities.authors),
    author: (root, { id }) => root.entities.authors[id],
    cards: (root, { category, limit, orderBy, sort }) => {
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
    card: (root, { id }) => root.entities.cards[id],
    categories: root =>
      Object.values(root.entities.categories).sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      }),
    category: (root, { id }) => root.entities.categories[id],
    search: (root, { input }) => {
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
  },
  Mutation: {
    contactUs: (_root, args) =>
      axios
        .post(
          'https://aliem-slackbot.now.sh/aliemcards/messages/contact-form',
          { data: args },
          {
            headers: {
              ALIEM_API_KEY: <string>process.env.ALIEM_API_KEY,
            },
          },
        )
        .then(res => res)
        .catch(() => ({
          status: 501,
          statusText: 'Server error encountered.',
        })),
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
