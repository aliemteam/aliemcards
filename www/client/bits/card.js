import React from 'react';
import axios from 'axios';

class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      card: {},
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
    return (
      <div dangerouslySetInnerHTML={this.getContent()} />
    );
  }
}

Card.propTypes = {
  card: React.PropTypes.object,
  params: React.PropTypes.object,
};

export default Card;
