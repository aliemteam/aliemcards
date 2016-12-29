const { join } = require('path');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(!isProduction),
  }),
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: Infinity,
    names: ['vendor', 'manifest'],
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
    compress: {
      warnings: false,
      unused: true,
      dead_code: true,
    },
    screw_ie8: true,
  }),
  // new BundleAnalyzerPlugin({
  //   analyzerMode: 'server',
  //   analyzerPort: 8888,
  //   openAnalyzer: true,
  // }),
]
: // Development plugins
[
  ...sharedPlugins,
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
];

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    bundle: isProduction ? ['babel-polyfill', './app/index'] : ['webpack-hot-middleware/client', 'babel-polyfill', './app/index'],
    vendor: ['react', 'react-dom'],
  },
  output: {
    path: join(__dirname, 'dist'),
    // filename: 'bundle.js',
    filename: '[name].js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.styl'],
  },
  plugins,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: isProduction
          ? ['babel-loader']
          : ['react-hot-loader', 'babel-loader'],
        include: join(__dirname, 'app'),
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
        ],
        include: join(__dirname, 'app'),
      },
    ],
  },
};
