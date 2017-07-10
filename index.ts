import * as compression from 'compression';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as helmet from 'helmet';
import OpticsAgent from 'optics-agent';
import { join } from 'path';
import { schema } from './server/schema';

const data = require('./server/data.json');

const isDevelopment = process.env.NODE_ENV !== 'production';
const app = express();

app.use(compression({ threshold: 0 }));
app.use(helmet());

if (isDevelopment) {
  const webpack = require('webpack');
  const config = require('../webpack.config.ts');
  const compiler = webpack(config);
  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: config.output.publicPath,
      historyApiFallback: true,
    }),
  );
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(OpticsAgent.middleware());

app.use(
  '/graphql',
  graphqlHTTP(req => ({
    schema: OpticsAgent.instrumentSchema(schema),
    graphiql: isDevelopment,
    context: {
      data,
      opticsContext: OpticsAgent.context(req),
    },
    rootValue: data,
  })),
);

app.use(express.static(join(__dirname, 'app'), { maxAge: 31557600000 })); // 1 year

app.get('*', (_, res) => {
  res.sendFile(join(__dirname, 'app', 'index.html'), { maxAge: 31557600000 }); // 1 year
});

app.listen(process.env.PORT || 3000);
