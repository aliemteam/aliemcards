import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import CardList from './CardList';

interface Props {
  data?: {
    cards: any[];
    categories: any[];
    networkStatus: number;
  };
  filter?: boolean;
}

interface State {
  categoryFilter: string;
}

const cardsAndCategories = gql`
  query cardsAndCategories {
    cards {
      id
      title
      categories {
        id
        name
      }
    }
    categories {
      id
      name
    }
  }
`;

@graphql(cardsAndCategories)
export default class CardListContainer extends React.PureComponent<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      categoryFilter: '',
    };
  }

  handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const category = e.currentTarget.value;
    this.setState({ categoryFilter: category });
  }

  render() {
    // Required to maintain strict typing
    if (!this.props.data) { throw new Error('Component should always receive data'); }

    const category = this.state.categoryFilter;
    let filterCards = this.props.data.cards;

    if (category) {
      filterCards = filterCards.filter(card => card.categories.findIndex(c => c.id === category) !== -1);
    }

    return (
      <CardList
        cards={filterCards}
        categories={this.props.data.categories}
        filter={this.props.filter}
        filterhandler={this.handleChange}
        filtervalue={this.state.categoryFilter}
      />
    );
  }
}
