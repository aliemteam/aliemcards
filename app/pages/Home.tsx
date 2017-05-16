import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { Card } from '../../server/models/';
import CardList from '../cards/CardList';

interface Props {
  data: {
    recentlyAdded: Array<Pick<Card, 'id'|'title'|'categories'|'updates'>>;
    recentlyUpdated: Array<Pick<Card, 'id'|'title'|'categories'|'updates'>>;
    networkStatus: number;
  };
}

export const homepageCards = gql`
  query homepageCards {
    recentlyAdded: cards(orderBy: created, limit: 5) {
      ...cardFragment
    }
    recentlyUpdated: cards(orderBy: updated, limit: 5) {
      ...cardFragment
    }
  }

  fragment cardFragment on Card {
    id
    title
    categories {
      id
      name
    }
    updates
  }
`;

@graphql(homepageCards)
export default class Home extends React.PureComponent<Props, {}> {
  render() {
    const newest = this.props.data.recentlyAdded || [];
    const updated = this.props.data.recentlyUpdated || [];
    return (
      <div className="row row--wrap">
        <div className="column column--50">
          <h1>New Cards</h1>
          { newest.length > 0 &&
            <CardList cards={newest} />
          }
        </div>
        <div className="column column--50">
          <h1>Updated Cards</h1>
          { updated.length > 0 &&
            <CardList cards={updated} />
          }
        </div>
      </div>
    );
  }
}
