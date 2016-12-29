/* eslint-disable global-require */
const express = require('express');
const compression = require('compression');
const { join } = require('path');
const webpack = require('webpack');
const graphqlHTTP = require('express-graphql');

const config = require('./webpack.config');
const { rootValue, schema } = require('./server/schema');

const isDevelopment = process.env.NODE_ENV !== 'production';
const app = express();
const compiler = webpack(config);

app.use(compression());

if (isDevelopment) {
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: isDevelopment,
}));

app.use('/', express.static(join(__dirname, 'dist')));

app.use('*', express.static(join(__dirname, 'dist')));

app.listen(3000, () => {
  console.log('listening on port 3000');
});
