import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Author, Category } from '../';
import { RootValue, SingleCardJSON, TypedFields } from '../../utils/strongTypes';
import authorType from '../author/authorType';
import categoryType from '../category/categoryType';

export type CardOrderBy = 'created' | 'updated';

export const cardOrderByType = new GraphQLEnumType({
  name: 'CardsOrderBy',
  description: 'Order cards by a specific field.',
  values: {
    created: { value: 'created' },
    updated: { value: 'updated' },
  },
});

export interface Card {
  /** List of authors. */
  authors: Author[];
  /** List of categories. */
  categories: Category[];
  /** Markdown string of the card's content. */
  content: string;
  /** UNIX timestamp of the original card creation date. */
  created: number;
  /** The ID of the card. */
  id: string;
  /** The title of the card. */
  title: string;
  /** List of UNIX timestamps of each time the card was updated. */
  updates: number[] | null;
};

const fields = (): TypedFields<Card, SingleCardJSON, RootValue> => ({
  authors: {
    description: 'List of authors.',
    type: new GraphQLList(authorType),
    resolve: (card, _args, context) => (
      card.authors.map(id => context.entities.authors[id])
    ),
  },
  categories: {
    description: 'List of categories.',
    type: new GraphQLList(categoryType),
    resolve: (card, _args, context) => (
      card.categories.map(id => context.entities.categories[id])
    ),
  },
  content: {
    description: "Markdown string of the card's content.",
    type: GraphQLString,
  },
  created: {
    description: 'UNIX timestamp of the original card creation date.',
    type: GraphQLFloat,
  },
  id: {
    description: 'The ID of the card.',
    type: new GraphQLNonNull(GraphQLString),
  },
  title: {
    description: 'The title of the card.',
    type: GraphQLString,
  },
  updates: {
    description: 'List of UNIX timestamps of each time the card was updated.',
    type: new GraphQLList(GraphQLFloat),
  },
});

export default new GraphQLObjectType({
  name: 'Card',
  description: 'Data representing a single card.',
  fields,
});
