import React from 'react';
import { post } from 'axios';

import CardList from '../cards/CardList';

export default class Category extends React.Component {

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
          categories
        }
      }`,
      variables: { category: this.props.params.category },
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { cards } = res.data.data;
      this.setState({
        cards,
        title: this.props.params.category
          .split('-')
          .map(c => c[0].toUpperCase() + c.slice(1))
          .join(' '),
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
  params: React.PropTypes.shape({
    category: React.PropTypes.string,
  }),
};
