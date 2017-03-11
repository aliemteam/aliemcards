export { Author, AuthorRaw } from './author/authorType';
export { APIResponse } from './misc/apiResponseType';
export { Card } from './card/cardType';
export { Category } from './category/categoryType';

import authorQuery from './author/authorQuery';
import cardQuery from './card/cardQuery';
import categoryQuery from './category/categoryQuery';

export const queries = {
  ...authorQuery,
  ...cardQuery,
  ...categoryQuery,
};

import miscMutation from './misc/miscMutation';

export const mutations = {
  ...miscMutation,
};
