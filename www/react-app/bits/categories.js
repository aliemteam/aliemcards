import React from 'react';
import axios from 'axios';

class CategoriesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: {},
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
          {Object.keys(this.state.categories).map((key) =>
            <li >
              <a href={`/categories/${this.state.categories[key].slug}`}>
                {this.state.categories[key].title}
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

CategoriesList.propTypes = {
  categories: React.PropTypes.object,
};

CategoriesList.defaultProps = {
};

export default CategoriesList;
