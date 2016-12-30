/* eslint-disable global-require */
const express = require('express');
const graphqlHTTP = require('express-graphql');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const { join } = require('path');
const webpack = require('webpack');

const config = require('./webpack.config');
const { rootValue, schema } = require('./server/schema');

const isDevelopment = process.env.NODE_ENV !== 'production';
const app = express();
const jsonParser = bodyParser.json();
const compiler = webpack(config);

app.use(compression({ threshold: 0 }));
app.use(helmet());

if (isDevelopment) {
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(express.static(join(__dirname, 'dist'), { maxAge: 31557600000 })); // 1 year

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: isDevelopment,
}));

app.post('/contact', jsonParser, (req, res) => {
  console.log(req);
  res.sendStatus(200);
});

app.use('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'), { maxAge: 31557600000 }); // 1 year
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
