import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RootContext } from '../schema';

export interface Category {
  id: string;
  name: string;
}

export const categoryType = new GraphQLObjectType(<RootContext>{
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
