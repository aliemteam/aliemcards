import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';
import { Link } from 'react-router';

export default class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      cards: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
      const { search: cards } = res.data.data;
      this.setState({ cards, query: input });
    })
    .catch(err => console.error(`Error: API response status code = ${err}`));
  }

  handleClick() {
    this.setState({ query: '', cards: [] });
  }

  render() {
    return (
      <div className="search">
        { this.props.splashText &&
          <div className="search__splash-text">
            <div>
              A Point-of-Care Reference Library
              by Michelle Lin, and the <strong>ALiEM Team</strong>
            </div>
            <div>
              Formerly known as <em>Paucis Verbis Cards</em>
            </div>
          </div>
        }
        <div className="search__input">
          <input
            type="text"
            onChange={this.handleChange}
            placeholder="Search"
            value={this.state.query}
          />
        </div>
        { this.state.cards.length > 0 &&
          <Results cards={this.state.cards} onClick={this.handleClick} />
        }
      </div>
    );
  }
}

Search.propTypes = {
  splashText: PropTypes.bool,
};
Search.defaultProps = {
  splashText: false,
};

const Results = ({ cards, onClick }) => (
  <div className="search__results">
    <ul>
      {cards.map(card => (
        <li className="search__result" key={card.id}>
          <Link to={`/cards/${card.id}`} onClick={onClick}>{card.title}</Link>
        </li>
      ))}
    </ul>
  </div>
);

Results.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  onClick: PropTypes.func.isRequired,
};
