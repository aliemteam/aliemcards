import React, { PureComponent } from 'react';
import { post } from 'axios';
import Cards from './Cards';


export default class CardsContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
      this.setState({ cards, categories });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  render() {
    return (
      <Cards
        title="Cards"
        cards={this.state.cards}
        categories={this.state.categories}
      />
    );
  }
}
