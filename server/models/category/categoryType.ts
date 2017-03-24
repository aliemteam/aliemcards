import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { TypedFields } from '../../utils/strongTypes';

export interface Category {
  id: string;
  name: string;
}

const fields = (): TypedFields<Category> => ({
  id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the category.',
    },
    name: {
      type: GraphQLString,
      description: 'The category name.',
    },
});

export default new GraphQLObjectType({
  name: 'Category',
  description: 'A single category',
  fields,
});
