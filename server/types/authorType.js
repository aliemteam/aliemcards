const {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

/**
 * authorType has the following shape:
 *   type Author {
 *     id: String!
 *     name: String
 *   }
 */
module.exports = new GraphQLObjectType({
  name: 'Author',
  description: 'A person who wrote a card.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the author.',
    },
    name: {
      type: GraphQLString,
      description: 'The author\'s name.',
    },
    cards: {
      type: new GraphQLList(require('./cardType.js')),
      description: 'A list of cards that the author wrote.',
      resolve: (author, args, context) => Object.values(context.entities.cards)
        .filter(c => c.authors.indexOf(author.id) !== -1),
    },
  }),
});
