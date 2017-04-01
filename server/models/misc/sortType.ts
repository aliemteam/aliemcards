import { GraphQLEnumType } from 'graphql';

export type AscOrDesc = 'asc' | 'desc';
export default new GraphQLEnumType({
  name: 'SortAscOrDesc',
  description: 'Sort direction of results.',
  values: {
    asc: { value: 'asc' },
    desc: { value: 'desc' },
  },
});
