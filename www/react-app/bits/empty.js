import React from 'react';

const Empty = ({ children }) =>
  <div>{children}</div>;

Empty.propTypes = {
  children: React.PropTypes.object,
};

Empty.defaultProps = {};

export default Empty;
