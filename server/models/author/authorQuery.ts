import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { ArgumentField } from '../../utils/strongTypes';
import authorType from './authorType';

const authors: ArgumentField<{}> = {
  type: new GraphQLList(authorType),
  description: 'Fetch a list of authors.',
  args: {},
  resolve: root => Object.values(root.entities.authors),
};

interface AuthorArgs {
  /** The ID of the author of interest. */
  id: string;
}

const author: ArgumentField<AuthorArgs> = {
  type: authorType,
  description: 'Fetch a single author.',
  args: {
    id: {
      description: 'The ID of the author of interest.',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (root, { id }: AuthorArgs) => root.entities.authors[id],
};

export default {
  authors,
  author,
};
