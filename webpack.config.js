const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/client/index',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot-loader', 'babel-loader'],
        include: path.resolve(__dirname, 'app'),
      },
    ],
  },
  // resolve: {
  //   extensions: ['*', '.js', '.jsx', '.json'],
  // },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: true,
  //       dead_code: true,
  //       unused: true,
  //       drop_debugger: true,
  //       drop_console: true,
  //     },
  //   }),
  // ],
};
