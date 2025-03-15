const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, 'node_modules')
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public_html/scripts'),
  },
};
