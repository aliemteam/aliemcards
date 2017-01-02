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
    post('/graphql', {
      query: `query cardsByCategory($category: String) {
        cards(category: $category) {
          id
          title
          categories {
            id
            name
          }
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
        { !this.state.loading &&
          <select value={this.state.categoryFilter} onChange={this.handleChange}>
            <option value="">Filter by Category:</option>
            {this.state.categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        }
        <CardList cards={this.state.cards} />
      </div>
    );
  }
}
