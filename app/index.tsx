import 'autotrack'; // Google Analytics global functions
import * as React from 'react';
import { render } from 'react-dom';
import * as WebFont from 'webfontloader';
import App from './App';

import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache(),
});

if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install();
}

WebFont.load({
  google: {
    families: ['Open Sans'],
  },
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
