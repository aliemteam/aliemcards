import React from 'react';
import axios from 'axios';

import Search from './search';
import TopBar from './topbar';
import CardList from './card-list';


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newest: [],
      updated: [],
    };
  }

  componentDidMount() {
    axios.get('/api/recent')
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ newest: res.data.data });
        }
      })
      .catch((error) => console.log(error));
    axios.get('/api/updated')
      .then(res => {
        if (res.data.status === 'success') {
          console.log(res.data.data);
          this.setState({ updated: res.data.data });
        }
      })
      .catch((error) => console.log(error));
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
        </div>
      </div>
    );
  }
}

export default Home;
