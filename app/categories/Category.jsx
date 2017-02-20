import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';

import CardList from '../cards/CardList';

export default class Category extends PureComponent {

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ category: PropTypes.string }),
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
    if (this.props.match.params.category !== prevProps.match.params.category) this.getCategory();
  }

  getCategory() {
    return post('/graphql', {
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
      variables: { category: this.props.match.params.category },
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { cards, category } = res.data.data;
      this.setState({
        cards,
        category,
      });
    })
    .catch(err => {
      console.error(`Error: API response status code = ${err}`);
    });
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
