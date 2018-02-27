import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { Helmet } from 'react-helmet';
import * as remark from 'remark';
import * as html from 'remark-html';

import { Card as ICard } from '../../server/schema';
import AddThis from '../components/AddThis';

interface Props {
  data: {
    card: ICard;
    networkStatus: number;
  };
  match: {
    params: {
      id: string;
    };
  };
  location: {
    pathname: string;
  };
}

const cardDataFromId = gql`
  query getCardById($id: String!) {
    card(id: $id) {
      id
      title
      authors {
        name
      }
      created
      updates
      content
    }
  }
`;

const config = {
  options: ({ match }) => ({ variables: { id: match.params.id } }),
};

@graphql(cardDataFromId, config)
export default class Card extends React.Component<Props> {
  render() {
    const { card, networkStatus } = this.props.data;
    if (networkStatus < 7) {
      return <div>Loading...</div>;
    }
    const lastUpdate = card.updates
      ? new Date(card.updates[0]).toLocaleDateString('en-US', {
          timeZone: 'UTC',
        })
      : new Date(card.created).toLocaleDateString('en-US', {
          timeZone: 'UTC',
        });
    return (
      <article role="article">
        <Helmet>
          <script type="application/ld+json">{JSON.stringify({ headline: card.title })}</script>
        </Helmet>
        <AddThis path={this.props.location.pathname} title={card.title} />
        <h1>{card.title}</h1>
        <div className="card">
          <div className="card__meta">
            <div>
              <strong>{card.authors.length > 1 ? 'Authors: ' : 'Author: '}</strong>
              {card.authors.map(author => author.name).join(', ')}
            </div>
            <div>
              <strong>Updated:</strong> {lastUpdate}
            </div>
          </div>
          <div
            className="card__content"
            dangerouslySetInnerHTML={{
              __html: remark()
                .use(html)
                .processSync(card.content).contents,
            }}
          />
        </div>
      </article>
    );
  }
}
