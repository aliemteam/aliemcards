import React from 'react';

const Loader = ({ visible }) =>
  <div className={visible ? 'spinner' : 'spinner spinner-hide'}>
    <i className="material-icons">autorenew</i>
  </div>;

Loader.propTypes = {
  visible: React.PropTypes.bool,
};

export default Loader;
