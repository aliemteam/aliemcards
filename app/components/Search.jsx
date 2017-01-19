import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';
import { Link } from 'react-router';
import Spinner from './Spinner';

export default class Search extends PureComponent {

  static propTypes = {
    splashText: PropTypes.bool,
  }

  static defaultProps = {
    splashText: false,
  }

  static timer;

  static postSearch(query) {
    return new Promise((resolve, reject) => {
      Search.timer = setTimeout(() => {
        post('/graphql', {
          query: `query searchForCard($input: String){
            search(input: $input) {
              id
              title
            }
          }`,
          variables: { input: query },
        })
        .then(res => {
          if (res.status !== 200) reject(res.status);
          const { search: cards } = res.data.data;
          resolve({ cards });
        });
      }, 500);
    });
  }

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
    clearTimeout(Search.timer);
    const query = e.currentTarget.value;
    const cards = query === '' ? [] : this.state.cards;

    if (query !== '') {
      Search.postSearch(query).then(this.setState.bind(this));
    }

    this.setState({ query, cards });
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
        <div className="search__input" role="search">
          <input
            type="text"
            onChange={this.handleChange}
            placeholder="Search"
            aria-label="Search for cards"
            value={this.state.query}
          />
        </div>
        { this.state.query !== '' &&
          <Results cards={this.state.cards} onClick={this.handleClick} />
        }
      </div>
    );
  }
}

const Results = ({ cards, onClick }) => (
  <div className="search__results">
    { cards.length === 0 &&
      <Spinner />
    }
    { cards.length > 0 &&
    <ul>
      {cards.map(card => (
        <li className="search__result" key={card.id}>
          <Link to={`/cards/${card.id}`} onClick={onClick}>{card.title}</Link>
        </li>
      ))}
    </ul>
    }
  </div>
);

Results.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  onClick: PropTypes.func.isRequired,
};
