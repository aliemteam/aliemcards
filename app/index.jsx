/* eslint-env browser */
import React from 'react';
import { render } from 'react-dom';
import App from './App';

require('offline-plugin/runtime').install();

render(<App />, document.getElementById('root'));
