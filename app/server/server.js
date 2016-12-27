const path = require('path');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { rootValue, schema } = require('./schema');

const app = express();

app.use('/', express.static(path.resolve(__dirname, '../client/assets')));

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

app.use('*', express.static(path.resolve(__dirname, '../client/assets')));

app.listen(3000, () => {
  console.log('listening on port 3000');
});
