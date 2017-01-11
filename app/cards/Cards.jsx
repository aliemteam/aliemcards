import React, { PureComponent, PropTypes } from 'react';
import CardList from './CardList';


export default class Cards extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      categoryFilter: '',
      filterCards: this.props.cards,
    };
  }

  handleChange(e) {
    const category = e.currentTarget.value;
    if (category === '') {
      this.setState({ filterCards: this.props.cards, categoryFilter: '' });
    } else {
      const filterCards = this.props.cards
      .filter(card => card.categories.findIndex(c => c.id === category) !== -1);
      this.setState({ filterCards, categoryFilter: category });
    }
  }

  render() {
    return (
      <div>
        <h1>{ this.props.title }</h1>
        { !this.state.loading &&
          <select value={this.state.categoryFilter} onChange={this.handleChange}>
            <option value="">Filter by Category:</option>
            {this.props.categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        }
        <CardList cards={this.state.filterCards} />
      </div>
    );
  }
}

Cards.propTypes = {
  title: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
  })),
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};
