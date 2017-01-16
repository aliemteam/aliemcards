import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';

import CardList from '../cards/CardList';

export default class Category extends PureComponent {

  static propTypes = {
    params: PropTypes.shape({
      category: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.getCategory = this.getCategory.bind(this);
    this.state = {
      cards: [],
      category: {},
    };
  }

  componentDidMount() {
    this.getCategory();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.category !== prevProps.params.category) this.getCategory();
  }

  getCategory() {
    post('/graphql', {
      query: `query CategoryAndCards($category: String!){
        cards(category: $category) {
          id
          title
          categories {
            id
            name
          }
        }
        category (id: $category) {
          id
          name
        }
      }`,
      variables: { category: this.props.params.category },
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { cards, category } = res.data.data;
      console.log(cards);
      this.setState({
        cards,
        category,
      });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  render() {
    return (
      <div>
        <h1>{this.state.category.name}</h1>
        <CardList cards={this.state.cards} />
      </div>
    );
  }
}
