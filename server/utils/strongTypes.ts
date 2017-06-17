import { GraphQLArgumentConfig, GraphQLFieldConfig, GraphQLFieldResolver, GraphQLOutputType } from 'graphql';
import { Announcement, AuthorRaw, Category } from '../models/';

interface AuthorJSON {
  [authorId: string]: AuthorRaw;
}

interface CategoryJSON {
  [categoryId: string]: Category;
}

export interface SingleCardJSON {
  authors: Array<keyof AuthorJSON>;
  categories: Array<keyof CategoryJSON>;
  content: string;
  created: number;
  id: string;
  title: string;
  updates: number[] | null;
}

interface CardJSON {
  [cardId: string]: SingleCardJSON;
}

/**
 * The complete shape of `data.json`
 */
export interface RootValue {
  announcements: Announcement[];
  entities: {
    authors: AuthorJSON;
    categories: CategoryJSON;
    cards: CardJSON;
  };
  result: Array<keyof CardJSON>;
}

export interface Context {
  data: RootValue;
}

interface ArgumentConfig extends GraphQLArgumentConfig {
  description: string;
}

interface FieldConfig<TSource, TContext = Context> extends GraphQLFieldConfig<TSource, TContext> {
  description: string;
}

export interface ArgumentField<TArgs> {
  type: GraphQLOutputType;
  args: {
    [P in keyof TArgs]: ArgumentConfig;
  };
  resolve?: GraphQLFieldResolver<RootValue, any>;
  deprecationReason?: string;
  description?: string;
}

export type TypedFields<TResolved, TRaw = TResolved, TContext = Context> = {
  [P in keyof TResolved]: FieldConfig<TRaw, TContext>;
};
