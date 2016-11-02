import React from 'react';
import axios from 'axios';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
    this.onChange = this.onChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  onChange(e) {
    this.handleSearch(e.target.value);
  }

  handleSearch(query) {
    if (query.length > 2) {
      axios.get(`/api/search/${query}`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ cards: res.data.data });
        }
      });
    } else {
      this.setState({ cards: [] });
    }
  }

  render() {
    return (
      <div className="searchbox">
        <form>
          <label><i className="material-icons">search</i></label>
          <input type="text" onChange={this.onChange} placeholder="Search" />
        </form>
        {this.state.cards[0] ? <Results cards={this.state.cards} /> : null}
      </div>
    );
  }
}

const Results = ({ cards }) =>
  <ul className="search-list">
    {cards.map((card) =>
      <li><a href={`/cards/${card.slug}`}>{card.title}</a></li>
    )}
  </ul>;

Search.propTypes = {
  params: React.PropTypes.object,
};

Search.defaultProps = {

};

export default Search;
