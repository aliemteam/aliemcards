const {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} = require('graphql');
const categoryType = require('./categoryType.js');

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
module.exports = new GraphQLObjectType({
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
      type: new GraphQLList(require('./authorType.js')),
      description: 'Array of author names.',
      resolve: (card, args, context) => card.authors.map(id => context.entities.authors[id]),
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
      resolve: (card, args, context) => card.categories.map(id => context.entities.categories[id]),
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
