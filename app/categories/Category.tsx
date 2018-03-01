import gql from 'graphql-tag';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Card as ICard, Category as ICategory } from '../../server/schema';
import CardList from '../cards/CardList';

export interface Data {
  cards: Array<Pick<ICard, 'id' | 'title' | 'categories'>>;
  category: Pick<ICategory, 'id' | 'name'>;
  networkStatus: number;
}

interface Props {
  data: Data;
  // Disabled because it's a false positive. This is used in the config object
  // tslint:disable-next-line:react-unused-props-and-state
  match: {
    params: {
      category: string;
    };
  };
}

const currentCategoryAndCards = gql`
  query CategoryAndCards($category: String!) {
    cards(category: $category) {
      id
      title
      categories {
        id
        name
      }
    }
    category(id: $category) {
      id
      name
    }
  }
`;

const config = {
  options: ({ match }: Props): any => ({
    variables: { category: match.params.category },
  }),
};

@graphql(currentCategoryAndCards, config)
export default class Category extends React.PureComponent<Props, {}> {
  render(): JSX.Element {
    const { cards, category, networkStatus } = this.props.data;
    if (networkStatus === 6) {
      return <div>Polling!</div>;
    }
    if (networkStatus < 7) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h1>{category.name}</h1>
        <CardList cards={cards || []} />
      </div>
    );
  }
}
