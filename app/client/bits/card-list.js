import React from 'react';
import { Link } from 'react-router';

const CardList = ({ cards }) =>
  <ul className="cards-list">
    {cards.map((card) =>
      <li key={card.slug}>
        <Link to={`/cards/${card.slug}`}>{card.title}</Link>
        <span className="metadata">
          {card.categories.map((cat) =>
            <Link to={`/categories/${cat}`}>{cat}</Link>
          )}
        </span>
      </li>
    )}
  </ul>;

CardList.propTypes = {
  cards: React.PropTypes.array,
};

CardList.defaultProps = {};

export default CardList;
