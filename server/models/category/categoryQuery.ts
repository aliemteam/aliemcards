import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { ArgumentField } from '../../utils/strongTypes';
import categoryType from './categoryType';

const categories: ArgumentField<{}> = {
  description: 'Fetch a list of categories.',
  type: new GraphQLList(categoryType),
  args: {},
  resolve: root => (
    Object.values(root.entities.categories)
      .sort((a, b) => {
        if (a.id < b.id) { return -1; }
        if (a.id > b.id) { return 1; }
        return 0;
      })
  ),
};

interface CategoryArgs {
  /** The ID of the category of interest. */
  id: string;
}

const category: ArgumentField<CategoryArgs> = {
  description: 'Fetch a single category.',
  type: categoryType,
  args: {
    id: {
      description: 'The ID of the category of interest.',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (root, { id }: CategoryArgs) => root.entities.categories[id],
};

export default {
  categories,
  category,
};
