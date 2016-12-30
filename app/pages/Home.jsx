import React, { PureComponent } from 'react';
import { post } from 'axios';

import CardList from '../cards/CardList';

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newest: [],
      updated: [],
    };
  }

  componentDidMount() {
    post('/graphql', {
      query: `
        query {
          recentlyAdded {
            ...cardFragment
          }
          recentlyUpdated {
            ...cardFragment
          }
        }

        fragment cardFragment on Card {
          id
          title
          categories
        }
      `,
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      const { recentlyAdded, recentlyUpdated } = res.data.data;
      this.setState({ newest: recentlyAdded, updated: recentlyUpdated });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  render() {
    return (
      <div className="row">
        <div className="one-half column">
          <h1>New Cards</h1>
          <CardList cards={this.state.newest} />
        </div>
        <div className="one-half column">
          <h1>Updated Cards</h1>
          <CardList cards={this.state.updated.filter(card => card.updates !== null)} />
        </div>
      </div>
    );
  }
}
