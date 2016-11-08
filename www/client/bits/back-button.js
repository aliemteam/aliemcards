import React from 'react';
import { browserHistory } from 'react-router';

const BackButton = () =>
  <button className="backButton" onClick={browserHistory.goBack}>&lt; Back</button>;

export default BackButton;
