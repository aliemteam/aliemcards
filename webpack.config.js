const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'app', 'client'),
  // devtool: 'eval-source-map',
  entry: {
    javascript: './index.js',
  },
  output: {
    path: path.resolve(__dirname, 'app', 'client', 'assets'),
    filename: 'index_bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'app', 'client', 'assets'),
    hot: true,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
  },
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
