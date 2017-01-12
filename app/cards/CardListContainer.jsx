import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';
import CardList from './CardList';


export default class CardListContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      categoryFilter: '',
      cards: [],
      categories: [],
      loading: true,
    };
  }

  componentDidMount() {
    post('/graphql', {
      query: `query {
        cards {
          id
          title
          categories {
            id
            name
          }
        }
        categories {
          id
          name
        }
      }`,
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { cards, categories } = res.data.data;
      this.setState({ cards, categories, categoryFilter: '', loading: false });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  handleChange(e) {
    const category = e.currentTarget.value;
    this.setState({ categoryFilter: category });
  }

  render() {
    const category = this.state.categoryFilter;
    let filterCards;
    if (category) {
      filterCards = this.state.cards
        .filter(card => card.categories.findIndex(c => c.id === category) !== -1);
    } else {
      filterCards = this.state.cards;
    }

    return (
      <CardList
        cards={filterCards}
        categories={this.state.categories}
        filter={this.props.filter}
        filterhandler={this.handleChange}
        filtervalue={this.state.categoryFilter}
        editortools={this.props.editortools}
      />
    );
  }
}

CardListContainer.propTypes = {
  editortools: PropTypes.bool,
  filter: PropTypes.bool,
};
