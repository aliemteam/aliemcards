import React, { PureComponent } from 'react';
import { post } from 'axios';
import CardList from './CardList';


export default class Cards extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      categoryFilter: '',
      cards: [],
      categories: [],
    };
  }

  componentDidMount() {
    post('/graphql', {
      query: `query {
        cards {
          id
          title
          categories
        }
        categories
      }`,
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { cards, categories } = res.data.data;
      this.setState({ cards, categories, categoryFilter: '' });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  handleChange(e) {
    const category = e.currentTarget.value;
    post('/graphql', {
      query: `query cardsByCategory($category: String) {
        cards(category: $category) {
          id
          title
          categories
        }
      }`,
      variables: { category },
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { cards } = res.data.data;
      this.setState({ ...this.state, cards, categoryFilter: category });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  render() {
    return (
      <div>
        <h1>Cards</h1>
        <select value={this.state.categoryFilter} onChange={this.handleChange}>
          <option value="">Filter by Category:</option>
          {this.state.categories.map(category => {
            const title = category
              .split('-')
              .map(c => c[0].toUpperCase() + c.slice(1))
              .join(' ');
            return (
              <option key={category} value={category}>{title}</option>
            );
          })}
        </select>
        <CardList cards={this.state.cards} />
      </div>
    );
  }
}
