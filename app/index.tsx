import * as React from 'react';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import * as WebFont from 'webfontloader';
import 'autotrack'; // Google Analytics global functions
import App from './App';

declare const __DEV__: boolean;

if (!__DEV__) {
  require('offline-plugin/runtime').install();
}

WebFont.load({
  google: {
    families: ['Open Sans'],
  },
});

const client = new ApolloClient();

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
