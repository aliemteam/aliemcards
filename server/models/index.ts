export { Author, AuthorRaw } from './author/authorType';
export { APIResponse } from './misc/apiResponseType';
export { Card } from './card/cardType';
export { Category } from './category/categoryType';
export { Announcement } from './announcement/announcementType';

import announcementQuery from './announcement/announcementQuery';
import authorQuery from './author/authorQuery';
import cardQuery from './card/cardQuery';
import categoryQuery from './category/categoryQuery';

export const queries = {
  ...announcementQuery,
  ...authorQuery,
  ...cardQuery,
  ...categoryQuery,
};

import miscMutation from './misc/miscMutation';

export const mutations = {
  ...miscMutation,
};
