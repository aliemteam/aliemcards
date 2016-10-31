import React from 'react';
import axios from 'axios';

class Tag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tag: {
        cards: [],
      },
    };
  }

  componentDidMount() {
    axios.get(`/api/tags/${this.props.params.tagslug}`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ tag: res.data.data });
        }
      });
  }

  render() {
    return (
      <div>
        <h1>{this.state.tag.title}</h1>
        <ul className="taxonomy-list">
          {this.state.tag.cards.map((card) =>
            <li key={card.slug}>
              <a href={`/tags/${this.state.tag.slug}/${card.slug}`}>{card.title}</a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

Tag.propTypes = {
  tag: React.PropTypes.object,
  params: React.PropTypes.object,
};

Tag.defaultProps = {};

export default Tag;
