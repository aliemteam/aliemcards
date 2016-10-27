const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'www', 'react-app'),
  // devtool: 'eval-source-map',
  entry: {
    javascript: './index.js',
  },
  output: {
    path: path.resolve(__dirname, 'www', 'assets'),
    filename: 'index_bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'www', 'react-app'),
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.json'],
  },
  // plugins: [
  //
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
