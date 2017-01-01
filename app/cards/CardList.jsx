import React from 'react';
import { Link } from 'react-router';

const CardList = ({ cards }) =>
  <div className="card-list">
    {cards.map(card =>
      <div key={card.id} className="card-list__item">
        <Link to={`/cards/${card.id}`} className="card-list__item-title">{card.title}</Link>{' '}
        {card.categories.map(category =>
          <Link to={`/categories/${category}`} key={category} className="card-list__item-meta">{category}</Link>
        )}
      </div>
    )}
  </div>;

CardList.propTypes = {
  cards: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    categories: React.PropTypes.arrayOf(React.PropTypes.string),
  })),
};

export default CardList;
