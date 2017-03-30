import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { TypedFields } from '../../utils/strongTypes';

export interface APIResponse {
  status: number;
  statusText: string;
}

const fields = (): TypedFields<APIResponse> => ({
  status: {
    description: 'Status code from API.',
    type: new GraphQLNonNull(GraphQLInt),
  },
  statusText: {
    description: 'Status text from API.',
    type: GraphQLString,
  },
});

export default new GraphQLObjectType({
  name: 'APIResponse',
  description: 'Generic response received from API calls',
  fields,
});
