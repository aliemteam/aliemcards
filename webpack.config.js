const { join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const autoprefixer = require('autoprefixer-stylus');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
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
  new webpack.optimize.UglifyJsPlugin({
    screw_ie8: true,
  }),
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

module.exports = {
  devtool: !isProduction ? 'eval-cheap-source-map' : false,
  entry: {
    bundle: isProduction ? ['babel-polyfill', './app/index'] : ['webpack-hot-middleware/client', 'babel-polyfill', './app/index'],
    vendor: ['react', 'react-dom'],
  },
  output: {
    path: join(__dirname, 'dist/app'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.styl'],
  },
  performance: { hints: false },
  plugins,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          join(__dirname, 'app'),
        ],
        use: isProduction
        ? ['babel-loader']
        : ['react-hot-loader', 'babel-loader'],
      },
      {
        test: /\.styl$/,
        include: [
          join(__dirname, 'app'),
        ],
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
        ],
      },
    ],
  },
};
