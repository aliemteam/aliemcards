import React from 'react';
import { browserHistory } from 'react-router';

export default () =>
  <button className="backButton" onClick={browserHistory.goBack}>&lt; Back</button>;
