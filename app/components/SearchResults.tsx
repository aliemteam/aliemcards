import gql from 'graphql-tag';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Card } from '../../server/schema';

interface Props {
  data?: {
    cards: Array<Pick<Card, 'id' | 'title'>>;
    networkStatus: number;
  };
  loadStatus: (status: number) => void;
  onClick: (e: React.MouseEvent<any>) => void;
  query: string;
}

const cardsMatchingSearch = gql`
  query searchForCard($query: String) {
    cards: search(input: $query) {
      id
      title
    }
  }
`;

const config = {
  options: ({ query }): any => ({ variables: { query } }),
};

@graphql(cardsMatchingSearch, config)
export default class SearchResults extends React.PureComponent<Props> {
  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.data) {
      this.props.loadStatus(nextProps.data.networkStatus);
    }
  }

  render(): JSX.Element | null {
    // Required for static typing
    if (!this.props.data) {
      throw new Error('Data should always be available');
    }
    if (this.props.query === '') {
      return null;
    }
    const { cards } = this.props.data;
    return (
      <div className="search__results">
        <ul>
          {this.props.data.cards.length === 0 &&
            this.props.data.networkStatus > 6 && (
              <li className="search__result search__noresult">No results found</li>
            )}
          {cards.map(card => (
            <li className="search__result" key={card.id}>
              <Link to={`/cards/${card.id}`} onClick={this.props.onClick}>
                {card.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
