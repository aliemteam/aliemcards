import React, { PureComponent } from 'react';
import { post } from 'axios';
import CardList from '../cards/CardList';


export default class NeverUpdated extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      categoryFilter: '',
      cards: [],
      filterCards: [],
      categories: [],
      loading: true,
    };
  }

  componentDidMount() {
    post('/graphql', {
      query: `query {
        neverUpdated {
          id
          title
          created
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
      const { categories } = res.data.data;
      const cards = res.data.data.neverUpdated;
      this.setState({ cards, categories, categoryFilter: '', loading: false, filterCards: cards });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  handleChange(e) {
    const category = e.currentTarget.value;
    this.setState({ categoryFilter: category });
    if (category) {
      const filterCards = this.state.cards
        .filter(card => card.categories.findIndex(c => c.id === category) !== -1);
      this.setState({ filterCards });
    } else {
      this.setState({ filterCards: this.state.cards });
    }
  }

  render() {
    return (
      <div>
        <h1>Never Updated - chronological</h1>
        { !this.state.loading &&
          <select value={this.state.categoryFilter} onChange={this.handleChange}>
            <option value="">Filter by Category:</option>
            {this.state.categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        }
        <CardList editortools cards={this.state.filterCards} />
      </div>
    );
  }
}
