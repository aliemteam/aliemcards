import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RootContext } from '../schema';

export interface Author {
  id: string;
  name: string;
}

export const authorType = new GraphQLObjectType(<RootContext>{
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
      type: new GraphQLList(require('./cardType.js').cardType),
      description: 'A list of cards that the author wrote.',
      resolve: (author: Author, _args, context) => (
        Object.values(context.entities.cards)
          .filter(c => c.authors.indexOf(author.id) !== -1)
      ),
    },
  }),
});
