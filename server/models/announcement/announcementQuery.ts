import { GraphQLInt, GraphQLList } from 'graphql';
import { ArgumentField } from '../../utils/strongTypes';
import sortType, { AscOrDesc } from '../misc/sortType';
import announcementType from './announcementType';

interface AnnouncementsArgs {
  /** Limit the response to n items. */
  limit: number;
  /** Sort ascending or descending. */
  sort: AscOrDesc;
}

const announcements: ArgumentField<AnnouncementsArgs> = {
  type: new GraphQLList(announcementType),
  description: 'Fetch a list of announcements.',
  args: {
    limit: {
      description: 'Limit the response to n items.',
      type: GraphQLInt,
      defaultValue: 1,
    },
    sort: {
      description: 'Sort order of the announcements.',
      type: sortType,
      defaultValue: 'desc',
    },
  },
  resolve: (root, { limit, sort }: AnnouncementsArgs) => {
    const payload = sort === 'desc'
      ? [ ...root.announcements ]
      : [ ...root.announcements ].reverse();
    return payload.slice(0, limit);
  },
};

export default {
  announcements,
};
