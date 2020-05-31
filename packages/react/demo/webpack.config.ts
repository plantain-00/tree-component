import * as webpack from 'webpack'

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './packages/react/demo/index',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  }
} as webpack.Configuration
