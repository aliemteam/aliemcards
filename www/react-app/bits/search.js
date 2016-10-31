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

  componentDidMount() {
    axios.get(`/api/search/${this.props.params.slug}`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ card: res.data.data });
        }
      });
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
    }
  }

  render() {
    return (
      <div>
        <form>
          <label>Search:</label>
          <input type="text" onChange={this.onChange} />
        </form>
        <ul className="cards-list">
          {this.state.cards.map((card) =>
            <li><a href={`/cards/${card.slug}`}>{card.title}</a></li>
          )}
        </ul>
      </div>
    );
  }
}

Search.propTypes = {
  params: React.PropTypes.object,
};

Search.defaultProps = {

};

export default Search;
