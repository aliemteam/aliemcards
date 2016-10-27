import React from 'react';

const Tag = function Tag({ tag }) {
  return (
    <div>
      <h1>{tag.title}</h1>
      <ul className="taxonomy-list">
        {tag.cards.map((card) =>
          <li key={card.slug}><a href={`/tags/${tag.slug}/${card.slug}`}>{card.title}</a></li>
        )}
      </ul>
    </div>
  );
};

Tag.propTypes = {
  tag: React.PropTypes.object,
};

Tag.defaultProps = {
};

export default Tag;
