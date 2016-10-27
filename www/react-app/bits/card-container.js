import React from 'react';
import axios from 'axios';

import Card from './card';

class CardContainer extends React.Component {

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

  render() {
    return (
      <Card card={this.state.card} />
    );
  }

}

CardContainer.propTypes = {
  params: React.PropTypes.object,
};

CardContainer.defaultProps = {

};

export default CardContainer;
