const path = require('path');
const webpack = require('webpack');
const express = require('express');
const config = require('../../webpack.config');
const graphqlHTTP = require('express-graphql');
const { rootValue, schema } = require('./schema');

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

// app.use('/', express.static(path.resolve(__dirname, '../client/assets')));

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

app.use('/', express.static(path.resolve(__dirname, '../client/assets/')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/assets/index.html'));
// });

app.listen(3000, () => {
  console.log('listening on port 3000');
});
