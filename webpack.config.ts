import * as autoprefixer from 'autoprefixer-stylus';
import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as OfflinePlugin from 'offline-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

import * as del from 'del';

import { execFileSync } from 'child_process';

del.sync(['dist/**', '!dist']);

execFileSync(path.resolve(__dirname, 'node_modules/.bin/tsc'), [
  '-p',
  path.resolve(__dirname, 'server'),
]);

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const plugins: Set<webpack.Plugin> = new Set([
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
  }),
  new webpack.DefinePlugin({
    __TEST__: JSON.stringify(false),
  }),
  new HtmlWebpackPlugin({
    template: './app/index.html',
    hash: true,
  }),
  // NOTE: I'd recommend switching to scss since it offers everything
  // stylus has and then some. Plus it has much more of a critical mass
  // than stylus.
  new webpack.LoaderOptionsPlugin({
    test: /\.styl$/,
    stylus: {
      default: {
        use: [autoprefixer({ browsers: ['last 2 versions'] })],
      },
    },
  }),
]);

// TODO:
// new webpack.optimize.CommonsChunkPlugin({
//   minChunks: Infinity,
//   names: ['vendor', 'manifest'],
// }),

if (IS_PRODUCTION) {
  plugins
    .add(new webpack.optimize.OccurrenceOrderPlugin(true))
    .add(new webpack.optimize.AggressiveMergingPlugin())
    .add(
      new OfflinePlugin({
        // FIXME: Waiting on a fix for this to be compatible with webpack 4
        ServiceWorker: {
          minify: false,
        },
      }),
    );
} else {
  plugins.add(new webpack.NamedModulesPlugin()).add(new webpack.HotModuleReplacementPlugin());
}

export default <webpack.Configuration>{
  mode: IS_PRODUCTION ? 'production' : 'development',
  entry: {
    'app/index': [...(IS_PRODUCTION ? [] : ['webpack-hot-middleware/client']), './app/index'],
    vendor: ['react', 'react-dom'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.styl', '.json'],
    plugins: [new TsConfigPathsPlugin /* { configFileName, compiler } */()],
  },
  plugins: [...plugins],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // include: [path.resolve(__dirname, 'app')],
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true,
              useCache: !IS_PRODUCTION,
              cacheDirectory: path.resolve(
                __dirname,
                'node_modules/.cache/awesome-typescript-loader',
              ),
              babelCore: '@babel/core',
            },
          },
        ],
      },
      {
        test: /\.styl$/,
        include: [path.resolve(__dirname, 'app')],
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
            },
          },
        ],
      },
    ],
  },
};
