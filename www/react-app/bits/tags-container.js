import React from 'react';
import axios from 'axios';
import TagsList from './tags-list';

class TagsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: {},
    };
  }

  componentDidMount() {
    axios.get('/api/tags')
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ tags: res.data.data });
        }
      });
  }

  render() {
    console.log('TagsList');
    return (
      <TagsList tags={this.state.tags} />
    );
  }

}

TagsContainer.propTypes = {

};

TagsContainer.defaultProps = {

};

export default TagsContainer;
