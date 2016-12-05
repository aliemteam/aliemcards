import React from 'react';

const Loader = ({ visible }) =>
  <div className={visible ? 'loader' : 'loader loader-hide'}>
    <i className="material-icons">autorenew</i>
  </div>;

export default Loader;
