import React from 'react';
import axios from 'axios';
import Tag from './tag';

class TagContainer extends React.Component {

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
      <Tag tag={this.state.tag} />
    );
  }

}

TagContainer.propTypes = {
  params: React.PropTypes.object,
};

TagContainer.defaultProps = {

};

export default TagContainer;
