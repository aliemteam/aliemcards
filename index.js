/* eslint-disable global-require */
const express = require('express');
const bodyParser = require('body-parser');
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
app.use(bodyParser.json());

if (isDevelopment) {
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use('/', express.static(join(__dirname, 'dist')));

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: isDevelopment,
}));

app.post('/contact', (req, res) => {
  console.log(req);
  res.sendStatus(200);
});

app.use('*', express.static(join(__dirname, 'dist')));

app.listen(3000, () => {
  console.log('listening on port 3000');
});
