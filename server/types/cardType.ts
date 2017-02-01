import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RootContext, SingleCardJSON } from '../schema';
import { Author } from './authorType';
import { Category, categoryType } from './categoryType';

export interface Card {
  id: string;
  title: string;
  authors: Author[];
  created: number;
  updates: number[]|null;
  categories: Category[];
  drugs: string[]|null;
  content: string;
};

export const cardType = new GraphQLObjectType(<RootContext>{
  name: 'Card',
  description: 'Data representing a single card.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the card.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the card.',
    },
    authors: {
      type: new GraphQLList(require('./authorType.js').authorType),
      description: 'Array of authors',
      resolve: (card: SingleCardJSON, _args, context) => card.authors.map(id => context.entities.authors[id]),
    },
    created: {
      type: GraphQLFloat,
      description: 'Integer JS timestamp representation of the Date the card was created.',
    },
    updates: {
      type: new GraphQLList(GraphQLFloat),
      description: 'Array of integer JS timestamps.',
    },
    categories: {
      type: new GraphQLList(categoryType),
      description: 'Array of categories.',
      resolve: (card: SingleCardJSON, _args, context) => card.categories.map(id => context.entities.categories[id]),
    },
    drugs: {
      type: new GraphQLList(GraphQLString),
      description: 'Array of drug names that pertain to the card.',
    },
    content: {
      type: GraphQLString,
      description: 'Markdown string of the card\'s content.',
    },
  }),
});
