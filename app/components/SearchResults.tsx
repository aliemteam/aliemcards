import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Card } from '../../server/models/';

interface Props {
  data?: {
    cards: Array<Pick<Card, 'id' | 'title'>>;
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
    if (!this.props.data) {
      throw new Error('Data should always be available');
    }
    if (this.props.query === '') {
      return null;
    }
    const { cards } = this.props.data;
    return (
      <div className="search__results">
        {// ajax request in process
        this.props.data.networkStatus < 7 &&
          <img className="search__loader" src="/assets/images/loader.svg" alt="loader" />}
        {// request complete and no results
        cards.length === 0 &&
          this.props.data.networkStatus > 6 &&
          <div className="search__noresult">No results found</div>}
        {// if there are cards, render them
        cards.length > 0 &&
          <ul>
            {cards.map(card =>
              <li className="search__result" key={card.id}>
                <Link to={`/cards/${card.id}`} onClick={this.props.onClick}>{card.title}</Link>
              </li>,
            )}
          </ul>}
      </div>
    );
  }
}
