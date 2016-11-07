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
    <form className="container">
      <label><i className="material-icons">search</i></label>
      <input type="text" onChange={changeHandler} placeholder="Search" />
    </form>
    {cards[0] ? <Results cards={cards} /> : null}
  </div>;

const SearchHero = ({ changeHandler, cards }) =>
  <div className="searchHero">
    <p>A Point-of-Care reference library<br />by Michelle Lin, and the <b>ALiEM Team</b></p>
    <p>Formerly known as <i>Paucis Verbis Cards</i></p>
    <form className="container">
      <label><i className="material-icons">search</i></label>
      <input type="text" onChange={changeHandler} placeholder="Search" />
    </form>
    {cards[0] ? <Results cards={cards} /> : null}
  </div>;

const Results = ({ cards }) =>
  <div className="container">
    <ul className="search-list">
      {cards.map((card) =>
        <li><a href={`/cards/${card.slug}`}>{card.title}</a></li>
      )}
    </ul>
  </div>;

Search.propTypes = {
  params: React.PropTypes.object,
  hero: React.PropTypes.bool,
};

Search.defaultProps = {
  hero: false,
};

export default Search;
