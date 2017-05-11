import { GraphQLObjectType, GraphQLString } from 'graphql';
import { TypedFields } from '../../utils/strongTypes';

export interface Announcement {
  /** Date string in the form of YYYY/MM/DD */
  date: string;
  /** Heading for announcement */
  heading: string;
  /** Announcement message */
  message: string;
}

const fields = (): TypedFields<Announcement> => ({
  date: {
    description: 'Date string in the form of YYYY/MM/DD',
    type: GraphQLString,
  },
  heading: {
    description: '',
    type: GraphQLString,
  },
  message: {
    description: '',
    type: GraphQLString,
  },
});

export default new GraphQLObjectType({
  name: 'Announcement',
  description: 'Data representing a single announcement.',
  fields,
});
