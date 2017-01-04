const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLFloat,
} = require('graphql');
const {
  cards,
  categories,
} = require('./data');

/**
 * categoryType has the following shape:
 *   type Category {
 *     id: String!
 *     name: String
 *   }
 */
const categoryType = new GraphQLObjectType({
  name: 'Category',
  description: 'A single category',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the category.',
    },
    name: {
      type: GraphQLString,
      description: 'The category name.',
    },
  }),
});

/**
 * cardType has the following shape:
 *   type Card {
 *     id: String!
 *     title: String
 *     authors: [String]
 *     created: Float
 *     updates: [Float]
 *     categories: [Category]
 *     drugs: [String]
 *     content: String
 *   }
 */
const cardType = new GraphQLObjectType({
  name: 'Card',
  description: 'Data representing a single card.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the card.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the card.',
    },
    authors: {
      type: new GraphQLList(GraphQLString),
      description: 'Array of author names.',
    },
    created: {
      type: GraphQLFloat,
      description: 'Integer JS timestamp representation of the Date the card was created.',
    },
    updates: {
      type: new GraphQLList(GraphQLFloat),
      description: 'Array of integer JS timestamps.',
    },
    categories: {
      type: new GraphQLList(categoryType),
      description: 'Array of categories that pertain to the card.',
      resolve: card => card.categories.map(c => categories.find(cat => cat.id === c)),
    },
    drugs: {
      type: new GraphQLList(GraphQLString),
      description: 'Array of drug names that pertain to the card.',
    },
    content: {
      type: GraphQLString,
      description: 'Markdown string of the card\'s content.',
    },
  }),
});

/**
 * queryType has the following shape:
 *   type Query {
 *     cards(category: String, drug: String): [Card]
 *     card(id: String!): Card
 *     categories(): [Category]
 *     recentlyAdded(n: Int): [Card]
 *     recentlyUpdated(n: Int): [Card]
 *     search(input: String): [Card]
 *   }
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
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
      resolve: (root, { category, drug }) => {
        if (!category && !drug) return cards;
        if (!category && drug) return cards.filter(c => c.drugs.indexOf(drug) !== -1);
        if (category && !drug) return cards.filter(c => c.categories.indexOf(category) !== -1);
        return cards.filter(
          c => c.categories.indexOf(category) !== -1 && c.drugs.indexOf(drug) !== -1
        );
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
      resolve: (root, { id }) => cards.find(card => card.id === id),
    },
    categories: {
      type: new GraphQLList(categoryType),
      resolve: root => categories, // eslint-disable-line
    },
    recentlyAdded: {
      type: new GraphQLList(cardType),
      args: {
        n: {
          type: GraphQLInt,
          description: '(Optional) Number of cards to return. Default 5.',
        },
      },
      resolve: (root, { n }) => (
        [...cards].sort((a, b) => {
          if (a.created < b.created) return 1;
          if (a.created > b.created) return -1;
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
      resolve: (root, { n }) => (
        cards.filter(card => card.updates)
        .sort((a, b) => {
          if (a.updates[0] < b.updates[0]) return 1;
          if (a.updates[0] > b.updates[0]) return -1;
          return 0;
        })
        .slice(0, n || 5)
      ),
    },
    search: {
      type: new GraphQLList(cardType),
      args: {
        input: {
          type: GraphQLString,
          description: 'A string used to find cards.',
        },
      },
      resolve: (root, { input }) => {
        if (!input) return [];
        const re = new RegExp(` ${input}`, 'gi');
        return cards.filter(card => re.test(card.content)).slice(0, 5);
      },
    },
  }),
});

exports.schema = new GraphQLSchema({
  query: queryType,
});
