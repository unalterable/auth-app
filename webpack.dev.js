const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: [
    '@babel/polyfill',
    './src/ui/index.jsx',
  ],
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'bundle.js',
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react'],
          },
        },
      },
    ],
  },
};
