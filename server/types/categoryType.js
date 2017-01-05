const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

/**
 * categoryType has the following shape:
 *   type Category {
 *     id: String!
 *     name: String
 *   }
 */
module.exports = new GraphQLObjectType({
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
