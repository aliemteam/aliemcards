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
    console.log(this.props.params.slug);
    axios.get(`/api/cards/${this.props.params.slug}`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ card: res.data.data });
          console.log(res.data.data);
        }
      });
  }
  getContent() {
    return {
      __html: this.state.card.content,
    };
  }

  render() {
    return (
      <div>
        <div dangerouslySetInnerHTML={this.getContent()} />
      </div>
    );
  }
}

Card.propTypes = {
  card: React.PropTypes.object,
  params: React.PropTypes.object,
};

export default Card;
