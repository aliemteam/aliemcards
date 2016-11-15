import React from 'react';
require('es6-promise').polyfill();
import axios from 'axios';

class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      card: {
        created: '',
        updated: [''],
        title: '',
      },
    };
  }

  componentDidMount() {
    axios.get(`/api/cards/${this.props.params.slug}`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ card: res.data.data });
        }
      })
      .catch((error) => console.log(error));
  }
  getContent() {
    return {
      __html: this.state.card.content,
    };
  }

  render() {
    const updated = new Date(this.state.card.updated[0]).toLocaleDateString('en-US');
    return (
      <div>
        <h1>{this.state.card.title}</h1>
        <ul className="cardMeta">
          <li><AuthorList authorArray={this.state.card.authors} /></li>
          <li><b>Updated:</b> {updated}</li>
        </ul>
        <div className="cardHtml" dangerouslySetInnerHTML={this.getContent()} />
      </div>
    );
  }
}

Card.propTypes = {
  card: React.PropTypes.object,
  params: React.PropTypes.object,
};

export default Card;


const AuthorList = ({ authorArray }) =>
  <span>
    <b>{authorArray.length > 1 ? 'Authors' : 'Author'}: </b>
    {authorArray.map((author) => <span className="author">{author}</span>)}
  </span>;

AuthorList.propTypes = {
  authorArray: React.PropTypes.array,
};

AuthorList.defaultProps = {
  authorArray: [],
};
