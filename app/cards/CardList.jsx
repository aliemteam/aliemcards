import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const CardList = ({ cards }) =>
  <div className="card-list">
    {cards.map(card =>
      <div key={card.id} className="card-list__item">
        <Link to={`/cards/${card.id}`} className="card-list__item-title">{card.title}</Link>{' '}
        {card.categories.map(category =>
          <Link to={`/categories/${category.id}`} key={`${card.id}-${category.id}`} className="card-list__item-meta">{category.name.toLowerCase()}</Link>
        )}
      </div>
    )}
  </div>;

CardList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
  })),
};

export default CardList;
