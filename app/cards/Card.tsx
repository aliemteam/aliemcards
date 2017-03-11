import * as marked from 'marked';
import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { Card as ICard } from '../../server/models/';

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
export default class Card extends React.PureComponent<Props, {}> {
  getContent() {
    return {
      __html: marked(this.props.data.card.content),
    };
  }

  render() {
    const { card, networkStatus } = this.props.data;
    if (networkStatus === 6) {
      return <div>Polling!</div>;
    }
    if (networkStatus < 7) {
      return <div>Loading...</div>;
    }
    const lastUpdate = card.updates
        ? new Date(card.updates[0]).toLocaleDateString('en-US')
        : new Date(card.created).toLocaleDateString('en-US');
    return (
      <article role="article">
        <h1>{card.title}</h1>
        <div className="card">
          <div className="card__meta">
            <div>
              <strong>{card.authors.length > 1 ? 'Authors: ' : 'Author: '}</strong>
              {card.authors.map(author => author.name).join(', ')}
            </div>
            <div><strong>Updated:</strong> {lastUpdate}</div>
          </div>
          <div className="card__content" dangerouslySetInnerHTML={this.getContent()} />
        </div>
      </article>
    );
  }
}
