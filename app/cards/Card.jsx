/* eslint-disable react/no-danger */
import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';
import marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

export default class Card extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      categories: [],
      content: '',
      created: null,
      drugs: null,
      id: '',
      title: '',
      updates: [],
      lastUpdate: '',
    };
  }

  componentDidMount() {
    this.getCard(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id === this.props.params.id) {
      return;
    }
    this.getCard(nextProps.params.id);
  }

  getCard(cardId) {
    post('/graphql', {
      query: `query getCardById($id: String!) {
        card(id: $id) {
          id
          title
          authors
          created
          updates
          content
        }
      }`,
      variables: { id: cardId },
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { card } = res.data.data;
      const lastUpdate = card.updates
        ? new Date(card.updates[0]).toLocaleDateString('en-US')
        : new Date(card.created).toLocaleDateString('en-US');
      this.setState({
        ...card,
        lastUpdate,
      });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  getContent() {
    return {
      __html: marked(this.state.content),
    };
  }

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <div className="card">
          <div className="card__meta">
            <div>
              <strong>{this.state.authors.length > 1 ? 'Authors: ' : 'Author: '}</strong>
              {this.state.authors.join(', ')}
            </div>
            <div><strong>Updated:</strong> {this.state.lastUpdate}</div>
          </div>
          <div className="card__content" dangerouslySetInnerHTML={this.getContent()} />
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
