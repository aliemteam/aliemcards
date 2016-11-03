import React from 'react';
import axios from 'axios';


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
      });
  }

  render() {
    return (
      <div>
        <h1>{this.state.category.title}</h1>
        <ul className="cards-list">
          {this.state.category.cards.map((card) =>
            <li key={card.slug}>
              <a href={`/categories/${this.state.category.slug}/${card.slug}`}>
                {card.title}
              </a>
              <span className="metadata">
                {card.categories.map((cat) =>
                  <a href={`/categories/${cat}`}>{cat}</a>
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
