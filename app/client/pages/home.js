import React from 'react';
import { post } from 'axios';

import Search from '../partials/search';
import TopBar from '../partials/topbar';
import CardList from '../cards/card-list';
import Footer from '../partials/footer';


export default class Home extends React.Component {

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
      <div>
        <div className="main">
          <TopBar
            title="ALiEM Cards"
          />
          <Search hero />
          <div className="home container content">
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
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
