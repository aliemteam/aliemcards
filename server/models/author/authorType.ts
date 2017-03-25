import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RootValue, TypedFields } from '../../utils/strongTypes';
import cardType, { Card } from '../card/cardType';

/**
 * The form of Author as it is received from JSON
 */
export interface AuthorRaw {
  /** The ID of the author. */
  id: string;
  /** The name of the author */
  name: string;
}

/**
 * The form of Author after being resolved by GraphQL
 */
export interface Author extends AuthorRaw {
  /** A list of cards that the author contributed to. */
  cards: Card[];
}

const fields = (): TypedFields<Author, AuthorRaw, RootValue> => ({
  id: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'The ID of the author.',
  },
  name: {
    type: GraphQLString,
    description: 'The name of the author.',
  },
  cards: {
    type: new GraphQLList(cardType),
    description: 'A list of cards that the author contributed to.',
    resolve: (author: AuthorRaw, _args, context) => (
      Object.values(context.entities.cards)
        .filter(c => c.authors.indexOf(author.id) !== -1)
    ),
  },
});

export default new GraphQLObjectType({
  name: 'Author',
  description: 'A person who wrote or contributed to a card.',
  fields,
});
