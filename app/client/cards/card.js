import React from 'react';
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

export default class Card extends React.Component {

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
    console.log(this.props);
    post('/graphql', {
      query: `query getCardById($id: ID!) {
        card(id: $id) {
          id
          title
          authors
          created
          updates
          content
        }
      }`,
      variables: { id: this.props.params.id },
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
        <ul className="cardMeta">
          <li><AuthorList authorArray={this.state.authors} /></li>
          <li><strong>Updated:</strong> {this.state.lastUpdate}</li>
        </ul>
        <div className="cardHtml" dangerouslySetInnerHTML={this.getContent()} />
      </div>
    );
  }
}

Card.propTypes = {
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
  }),
};

const AuthorList = ({ authorArray }) =>
  <span>
    <strong>{authorArray.length > 1 ? 'Authors' : 'Author'}: </strong>
    {authorArray.map(author => <span key={author} className="author">{author}</span>)}
  </span>;

AuthorList.propTypes = {
  authorArray: React.PropTypes.arrayOf(String),
};
AuthorList.defaultProps = {
  authorArray: [],
};
