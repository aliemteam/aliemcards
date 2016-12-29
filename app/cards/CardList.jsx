import React from 'react';
import Link from 'react-router/lib/Link';

const CardList = ({ cards }) =>
  <ul className="cards-list">
    {cards.map(card =>
      <li key={card.id}>
        <Link to={`/cards/${card.id}`}>{card.title}</Link>
        <span className="metadata">
          {card.categories.map(category =>
            <Link key={category} to={`/categories/${category}`}>{category}</Link>
          )}
        </span>
      </li>
    )}
  </ul>;

CardList.propTypes = {
  cards: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    categories: React.PropTypes.arrayOf(React.PropTypes.string),
  })),
};

export default CardList;
