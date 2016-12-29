import React from 'react';
import { post } from 'axios';
import { Link } from 'react-router';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      cards: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const input = e.currentTarget.value;
    post('/graphql', {
      query: `query searchForCard($input: String){
        search(input: $input) {
          id
          title
        }
      }`,
      variables: { input },
    })
    .then(res => {
      if (res.status !== 200) throw res.status;
      console.log(res);
      const { search: cards } = res.data.data;
      this.setState({ cards, query: input });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  render() {
    return (
      <div className="search">
        { this.props.hero &&
          <div className="search__splash-text">
            <p>A Point-of-Care reference library<br />
            by Michelle Lin, and the <strong>ALiEM Team</strong></p>
            <p>Formerly known as <em>Paucis Verbis Cards</em></p>
          </div>
        }
        <div className="search__input">
          <input type="text" onChange={this.handleChange} placeholder="Search" />
        </div>
        { this.state.cards.length > 0 &&
          <Results cards={this.state.cards} />
        }
      </div>
    );
  }
}

Search.propTypes = {
  hero: React.PropTypes.bool,
};
Search.defaultProps = {
  hero: false,
};

const Results = ({ cards }) => (
  <div className="container">
    <ul className="searchList">
      {cards.map((card) => (
        <li><Link to={`/cards/${card.id}`}>{card.title}</Link></li>
      ))}
    </ul>
  </div>
);

Results.propTypes = {
  cards: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
  })).isRequired,
};

export default Search;
