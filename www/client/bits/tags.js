import React from 'react';
import axios from 'axios';

class Tags extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
    };
  }

  componentDidMount() {
    axios.get('/api/tags')
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ tags: res.data.data });
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div>
        <h1>Tags</h1>
        <ul className="taxonomy-list">
          {this.state.tags.map((tag) =>
            <li><a href={`/tags/${tag.slug}`}>{tag.title}</a></li>
          )}
        </ul>
      </div>
    );
  }

}

Tags.propTypes = {
  tag: React.PropTypes.object,
  params: React.PropTypes.object,
};

Tags.defaultProps = {

};

export default Tags;
