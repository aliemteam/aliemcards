import React from 'react';
import axios from 'axios';

class Cards extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.filterCards = this.filterCards.bind(this);
    this.state = {
      cards: [],
      filterCards: [],
    };
  }

  componentDidMount() {
    axios.get('/api/cards')
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ cards: res.data.data, filterCards: res.data.data });
        }
      });
  }

  onChange(e) {
    this.setState({ filterCards: this.filterCards(e.target.value) });
  }

  filterCards(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? this.state.cards : this.state.cards.filter((card) => {
      if (typeof(card.title) === 'string'
        && card.title.toString().toLowerCase().search(inputValue) > -1)
      {
        return true;
      } else {
        return false;
      }
    });
  }

  slugify(text) {
    return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  }

  render() {
    return (
      <div>
        <h1>Cards</h1>
        <form>
          <label>Filter by Title:</label>
          <input type="text" onChange={this.onChange} />
        </form>
        <ul className="cards-list">
          {this.state.filterCards.map((card) =>
            <li >
              <a href={`/cards/${card.slug}`}>
                {card.title}
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

Cards.propTypes = {

};

Cards.defaultProps = {

};

export default Cards;
