const path = require('path')

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', './client/index'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
}
