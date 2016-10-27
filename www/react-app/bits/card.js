import React from 'react';

class Card extends React.Component {

  constructor(props) {
    super(props);
  }

  getContent() {
    return {
      __html: this.props.card.content,
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
  routes: React.PropTypes.object,
};

export default Card;
