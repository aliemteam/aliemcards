import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';
import { Link } from 'react-router-dom';

export default class Categories extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
    };
  }

  componentDidMount() {
    post('/graphql', {
      query: `query {
        categories {
          id
          name
        }
      }`,
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { categories } = res.data.data;
      this.setState({ categories, loading: false });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  render() {
    return (
      <div>
        <h1>Categories</h1>
        <Results categories={this.state.categories} />
      </div>
    );
  }
}

const Results = ({ categories }) =>
  <div className="card-list">
    {categories.map(category => (
      <div key={category.id} className="card-list__item">
        <Link to={`/categories/${category.id}`} className="card-list__item-title">{category.name}</Link>
      </div>
      )
    )}
  </div>;

Results.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};
