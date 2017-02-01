import * as axios from 'axios';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as helmet from 'helmet';
import { join } from 'path';
import { schema } from './server/schema';

const data = require('./server/data.json'); // FIXME: wildcard module this so we can "import"

const isDevelopment = process.env.NODE_ENV !== 'production';
const app = express();
const jsonParser = bodyParser.json();

app.use(compression({ threshold: 0 }));
app.use(helmet());

if (isDevelopment) {
  const webpack = require('webpack');
  const config = require('../webpack.config');
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

// app.use(express.static(join(__dirname, 'dist'), { maxAge: 31557600000 })); // 1 year

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: isDevelopment,
  context: data,
}));

app.post('/contact', jsonParser, (req, res) => {
  axios.post('https://aliem-slackbot.now.sh/aliemcards/messages/contact-form', req.body, {
    headers: {
      ALIEM_API_KEY: <string>process.env.ALIEM_API_KEY,
    },
  })
  .then(() => res.sendStatus(200))
  .catch((e: Error) => res.status(502).send(e.message));
});

app.use(express.static(join(__dirname, 'dist'), { maxAge: 31557600000 })); // 1 year

// app.get('*', (_, res) => {
//   res.sendFile(join(__dirname, 'app', 'index.html'), { maxAge: 31557600000 }); // 1 year
// });

app.listen(process.env.PORT || 3000);
