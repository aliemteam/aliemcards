import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { mutations, queries } from './models/';

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    ...queries,
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    ...mutations,
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
