import React from 'react';
import axios from 'axios';

import Search from './search';
import TopBar from './topbar';


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newest: [],
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
            <h1>New Cards</h1>
            <ul className="cards-list">
              {this.state.newest.map((card) =>
                <li key={card.slug}>
                  <a href={`/cards/${card.slug}`}>{card.title}</a>
                  <span className="metadata">
                    {card.categories.map((cat) =>
                      <a href={`/categories/${cat}`}>{cat}</a>
                    )}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
