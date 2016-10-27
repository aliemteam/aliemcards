import React from 'react';

const TagsList = ({ tags }) => {
  return (
    <div>
      <h1>Tags</h1>
      <ul className="taxonomy-list">
        {Object.keys(tags).map((key) =>
          <li ><a href={`/tags/${tags[key].slug}`}>{tags[key].title}</a></li>
        )}
      </ul>
    </div>
  );
};

TagsList.propTypes = {
  tags: React.PropTypes.object,
};

TagsList.defaultProps = {
};

export default TagsList;
