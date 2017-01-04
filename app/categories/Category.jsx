import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';

import CardList from '../cards/CardList';

export default class Category extends PureComponent {

  constructor(props) {
    super(props);
    this.getCategory = this.getCategory.bind(this);
    this.state = {
      cards: [],
      title: '',
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
      query: `query getCategoryCards($category: String) {
        cards(category: $category) {
          id
          title
          categories {
            id
            name
          }
        }
      }`,
      variables: { category: this.props.params.category },
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { cards } = res.data.data;
      this.setState({
        cards,
        title: cards[0].categories[0].name,
      });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <CardList cards={this.state.cards} />
      </div>
    );
  }
}

Category.propTypes = {
  params: PropTypes.shape({
    category: PropTypes.string,
  }),
};
