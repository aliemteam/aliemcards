import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Card } from '../../server/types/';

interface Props {
  data?: {
    cards: Array<Pick<Card, 'id'|'title'>>;
    networkStatus: number;
  };
  onClick: (e: React.MouseEvent<any>) => void;
  query: string;
}

const cardsMatchingSearch = gql`
  query searchForCard($query: String){
    cards: search(input: $query) {
      id
      title
    }
  }
`;

const config = {
  options: ({ query }) => ({ variables: { query } }),
};

@graphql(cardsMatchingSearch, config)
export default class SearchResults extends React.PureComponent<Props, {}> {
  render() {
    // Required for static typing
    if (!this.props.data) { throw new Error('Data should always be available'); }
    if (!this.props.data.cards || this.props.data.cards.length === 0) {
      return null;
    }
    const { cards } = this.props.data;
    return (
      <div className="search__results">
        <ul>
          {cards.map(card => (
            <li className="search__result" key={card.id}>
              <Link to={`/cards/${card.id}`} onClick={this.props.onClick}>{card.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
