import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Loader from './loader';

class Categories extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
    };
  }

  componentDidMount() {
    axios.get('/api/categories')
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ categories: res.data.data, loading: false });
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div>
        <h1>Categories</h1>
        <Loader visible={this.state.loading} />
        <Results cats={this.state.categories} />
      </div>
    );
  }
}

Categories.propTypes = {
  categories: React.PropTypes.object,
};

Categories.defaultProps = {};

const Results = ({ cats }) =>
  <ul className="cards-list">
    {cats.map((cat) =>
      <li><Link to={`/categories/${cat.slug}`}>{cat.title}</Link></li>
    )}
  </ul>;

Results.propTypes = {
  cats: React.PropTypes.array,
};

export default Categories;
