/* eslint-env browser */
import React from 'react';
import { render } from 'react-dom';
import App from './App';

if (!__DEV__) {
  require('offline-plugin/runtime').install(); // eslint-disable-line
}

render(<App />, document.getElementById('root'));
