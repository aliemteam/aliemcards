import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { queries } from './models/';

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...queries,
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
});
