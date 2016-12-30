import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';
import { Link } from 'react-router';

import Spinner from '../components/Spinner';

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
        <Spinner visible={this.state.loading} />
        <Results categories={this.state.categories} />
      </div>
    );
  }
}

const Results = ({ categories }) =>
  <ul className="cards-list">
    {categories.map(category => {
      const title = category
        .split('-')
        .map(c => c[0].toUpperCase() + c.slice(1))
        .join(' ');
      return (
        <li key={category}><Link to={`/categories/${category}`}>{title}</Link></li>
      );
    })}
  </ul>;

Results.propTypes = {
  categories: PropTypes.arrayOf(String),
};
