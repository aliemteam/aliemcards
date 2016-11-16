import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import CardList from './card-list';


class Category extends React.Component {

  constructor(props) {
    super(props);
    this.getCategory = this.getCategory.bind(this);
    this.state = {
      category: {
        cards: [],
      },
    };
  }

  componentDidMount() {
    this.getCategory();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.catslug !== prevProps.params.catslug) this.getCategory();
  }

  getCategory() {
    axios.get(`/api/categories/${this.props.params.catslug}`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ category: res.data.data });
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div>
        <h1>{this.state.category.title}</h1>
        <CardList cards={this.state.category.cards} />
      </div>
    );
  }
}

Category.propTypes = {
  category: React.PropTypes.object,
  params: React.PropTypes.object,
};

Category.defaultProps = {};

export default Category;
