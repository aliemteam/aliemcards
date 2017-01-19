import React, { PureComponent, PropTypes } from 'react';
import { post } from 'axios';
import { Link } from 'react-router';

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
          resolve({ cards, loading: false });
        });
      }, 500);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      cards: [],
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    clearTimeout(Search.timer);
    const query = e.currentTarget.value;
    const loading = query !== '';
    const cards = query === '' ? [] : this.state.cards;

    if (query !== '') {
      Search.postSearch(query).then(this.setState.bind(this));
    }
    this.setState({ query, cards, loading });
  }

  handleClick() {
    this.setState({ query: '', cards: [], loading: false });
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
          { this.state.loading === true &&
          <img className="search__loader" src="/assets/images/loader.svg" alt="loader" />
          }
        </div>
        { this.state.cards.length > 0 &&
          <Results cards={this.state.cards} onClick={this.handleClick} />
        }
      </div>
    );
  }
}

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
