import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  onChange(e) {
    this.handleSearch(e.target.value);
  }

  onBlur(x) {
    x.target.value = '';
    this.handleSearch('');
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
          blurHandler={this.onBlur}
          cards={this.state.cards}
        />
      );
    }
    return <SearchBar changeHandler={this.onChange} blurHandler={this.onBlur} cards={this.state.cards} />;
  }
}

const SearchBar = ({ changeHandler, blurHandler, cards }) =>
  <div className="searchBox">
    <form className="container">
      <input type="text" onChange={changeHandler} onBlur={blurHandler} placeholder="Search" autofocus />
      <button type="submit"><i className="material-icons">search</i></button>
    </form>
    {cards[0] ? <Results cards={cards} /> : null}
  </div>;

const SearchHero = ({ changeHandler, blurHandler, cards }) =>
  <div className="searchHero">
    <div className="heroText">
      <p>A Point-of-Care reference library<br />by Michelle Lin, and the <b>ALiEM Team</b></p>
      <p>Formerly known as <i>Paucis Verbis Cards</i></p>
    </div>
    <SearchBar changeHandler={changeHandler} blurHandler={blurHandler} cards={cards} />
  </div>;

const Results = ({ cards }) =>
  <div className="container">
    <ul className="searchList">
      {cards.map((card) =>
        <li><Link to={`/cards/${card.slug}`}>{card.title}</Link></li>
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