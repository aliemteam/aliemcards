import React from 'react';
import axios from 'axios';

class Categories extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    axios.get('/api/categories')
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ categories: res.data.data });
        }
      });
  }

  render() {
    return (
      <div>
        <h1>Categories</h1>
        <ul className="taxonomy-list">
          {this.state.categories.map((cat) =>
            <li><a href={`/categories/${cat.slug}`}>{cat.title}</a></li>
          )}
        </ul>
      </div>
    );
  }
}

Categories.propTypes = {
  categories: React.PropTypes.object,
};

Categories.defaultProps = {};

export default Categories;
