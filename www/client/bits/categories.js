import React from 'react';
import axios from 'axios';
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
    console.log('compontent mount');
    axios.get('/api/categories')
      .then(res => {
        console.log(res.data);
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
        {this.state.loading ? <Loader /> : <Results cats={this.state.categories} />}
      </div>
    );
  }
}

Categories.propTypes = {
  categories: React.PropTypes.object,
};

Categories.defaultProps = {};

const Results = ({ cats }) =>
  <ul className="taxonomy-list">
    {cats.map((cat) =>
      <li><a href={`/categories/${cat.slug}`}>{cat.title}</a></li>
    )}
  </ul>;

Results.propTypes = {
  cats: React.PropTypes.array,
};

export default Categories;
