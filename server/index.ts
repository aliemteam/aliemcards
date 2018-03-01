import { Engine } from 'apollo-engine';
import { graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import * as path from 'path';

import { schema } from './schema';
const data = require('./data.json');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();

if (IS_PRODUCTION) {
  const engine = new Engine({
    engineConfig: {
      apiKey: process.env.APOLLO_ENGINE_KEY || '',
    },
    graphqlPort: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  });
  engine.start();
  app.use(engine.expressMiddleware());
  app.use(compression());
} else {
  const webpack = require('webpack');
  const config = require('../../webpack.config.ts').default;
  const compiler = webpack(config);
  app.use(compression());
  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: config.output.publicPath,
      historyApiFallback: true,
    }),
  );
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(helmet());
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(_ => ({
    schema,
    graphiql: !IS_PRODUCTION,
    context: {
      data,
    },
    rootValue: data,
    tracing: true,
    cacheControl: true,
  })),
);

app.use(express.static(path.resolve(__dirname, '../app'), { maxAge: 31557600000 })); // 1 year

app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, '../app', 'index.html'), { maxAge: 31557600000 }); // 1 year
});

app.listen(process.env.PORT || 3000);
