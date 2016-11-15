import React from 'react';
require('es6-promise').polyfill();
import axios from 'axios';
import { Link } from 'react-router';


class Category extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      category: {
        cards: [],
      },
    };
  }

  componentDidMount() {
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
        <ul className="cards-list">
          {this.state.category.cards.map((card) =>
            <li key={card.slug}>
              <Link to={`/categories/${this.state.category.slug}/${card.slug}`}>
                {card.title}
              </Link>
              <span className="metadata">
                {card.categories.map((cat) =>
                  <Link to={`/categories/${cat}`}>{cat}</Link>
                )}
              </span>
            </li>
          )}
        </ul>
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
