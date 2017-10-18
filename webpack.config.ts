import * as autoprefixer from 'autoprefixer-stylus';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as OfflinePlugin from 'offline-plugin';
import { join } from 'path';
import * as webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins = [
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(!isProduction),
    __TEST__: JSON.stringify(false),
  }),
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: Infinity,
    names: ['vendor', 'manifest'],
  }),
  new HtmlWebpackPlugin({
    template: './app/index.html',
    hash: true,
  }),
  new webpack.LoaderOptionsPlugin({
    test: /\.styl$/,
    stylus: {
      default: {
        use: [autoprefixer({ browsers: ['last 2 versions'] })],
      },
    },
  }),
];

const plugins = isProduction
  ? // Production plugins
    [
      ...sharedPlugins,
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new OfflinePlugin(),
      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'server',
      //   analyzerPort: 8888,
      //   openAnalyzer: true,
      // }),
    ]
  : // Development plugins
    [
      ...sharedPlugins,
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ];

const tsLoader = {
  loader: 'ts-loader',
  options: {
    configFile: join(__dirname, 'app/tsconfig.json'),
  },
};

module.exports = {
  devtool: !isProduction ? 'eval-cheap-source-map' : false,
  entry: {
    bundle: isProduction
      ? ['babel-polyfill', 'raf/polyfill', './app/index']
      : ['webpack-hot-middleware/client', 'babel-polyfill', 'raf/polyfill', './app/index'],
    vendor: ['react', 'react-dom'],
  },
  output: {
    path: join(__dirname, 'dist/app'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.styl', '.json'],
  },
  performance: { hints: false },
  plugins,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [join(__dirname, 'app')],
        use: isProduction
          ? ['babel-loader', tsLoader]
          : ['react-hot-loader', 'babel-loader', tsLoader],
      },
      {
        // necessary to load google autotrack
        test: /\.js?$/,
        use: { loader: 'babel-loader' },
        exclude: /node_modules\/(?!(autotrack|dom-utils))/,
      },
      {
        test: /\.styl$/,
        include: [join(__dirname, 'app')],
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
    ],
  },
};
