/*
Tutorials:
- https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
- http://tylermcginnis.com/react-js-tutorial-1-5-utilizing-webpack-and-babel-to-build-a-react-js-app/
- https://www.twilio.com/blog/2015/08/setting-up-react-for-es6-with-webpack-and-babel-2.html
*/
const path = require('path');
// const webpack = require('webpack');

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
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.json'],
  },
  plugins: [

    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: true,
    //     dead_code: true,
    //     unused: true,
    //     drop_debugger: true,
    //     drop_console: true,
    //   },
    // }),
  ],
};
