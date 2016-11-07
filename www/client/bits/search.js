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
    if (this.props.hero) {
      return (
        <SearchHero
          changeHandler={this.onChange}
          cards={this.state.cards}
        />
      );
    }
    return <SearchBar changeHandler={this.onChange} cards={this.state.cards} />;
  }
}

const SearchBar = ({ changeHandler, cards }) =>
  <div className="searchbox">
    <div className="container">
      <form>
        <label><i className="material-icons">search</i></label>
        <input type="text" onChange={changeHandler} placeholder="Search" />
      </form>
      {cards[0] ? <Results cards={cards} /> : null}
    </div>
  </div>;

const SearchHero = ({ changeHandler, cards }) =>
  <div className="searchHero">
    <p><i>A point-of-care reference</i><br /><b>by</b> Emergency Medicine providers<br />
    for Emergency Medicine providers.
    </p>
    <form className="container">
      <label><i className="material-icons">search</i></label>
      <input type="text" onChange={changeHandler} placeholder="Search" />
    </form>
    {cards[0] ? <Results cards={cards} /> : null}
  </div>;

const Results = ({ cards }) =>
  <ul className="search-list">
    {cards.map((card) =>
      <li><a href={`/cards/${card.slug}`}>{card.title}</a></li>
    )}
  </ul>;

Search.propTypes = {
  params: React.PropTypes.object,
  hero: React.PropTypes.bool,
};

Search.defaultProps = {
  hero: false,
};

export default Search;
