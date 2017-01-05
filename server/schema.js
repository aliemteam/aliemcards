const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql');
const {
  authorType,
  cardType,
  categoryType,
} = require('./types/');

/**
 * queryType has the following shape:
 *   type Query {
 *     authors(): [Author]
 *     author(id: String!): Author
 *     cards(category: String, drug: String): [Card]
 *     card(id: String!): Card
 *     categories(): [Category],
 *     recentlyAdded(n: Int): [Card]
 *     recentlyUpdated(n: Int): [Card]
 *     search(input: String): [Card]
 *   }
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    authors: {
      type: new GraphQLList(authorType),
      resolve: (root, args, context) => Object.values(context.entities.authors),
    },
    author: {
      type: authorType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The id of the author of interest.',
        },
      },
      resolve: (root, { id }, context) => context.entities.authors[id],
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
      resolve: (root, { category, drug }, context) => {
        const cards = Object.values(context.entities.cards);
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
      resolve: (root, { id }, context) => context.entities.cards[id],
    },
    categories: {
      type: new GraphQLList(categoryType),
      resolve: (root, args, context) => Object.values(context.entities.categories),
    },
    recentlyAdded: {
      type: new GraphQLList(cardType),
      args: {
        n: {
          type: GraphQLInt,
          description: '(Optional) Number of cards to return. Default 5.',
        },
      },
      resolve: (root, { n }, context) => (
        Object.values(context.entities.cards).sort((a, b) => {
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
      resolve: (root, { n }, context) => (
        Object.values(context.entities.cards)
        .filter(card => card.updates)
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
      resolve: (root, { input }, context) => {
        if (!input) return [];
        const re = new RegExp(` ${input}`, 'gi');
        return Object.values(context.entities.cards)
        .filter(card => re.test(card.content))
        .slice(0, 5);
      },
    },
  }),
});

exports.schema = new GraphQLSchema({
  query: queryType,
});
