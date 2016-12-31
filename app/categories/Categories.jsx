import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';
import { Link } from 'react-router';

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
        categories
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
    {categories.map(category => {
      const title = category
        .split('-')
        .map(c => c[0].toUpperCase() + c.slice(1))
        .join(' ');
      return (
        <div key={category} className="card-list__item">
          <Link to={`/categories/${category}`} className="card-list__item-title">{title}</Link>
        </div>
      );
    })}
  </div>;

Results.propTypes = {
  categories: PropTypes.arrayOf(String),
};
