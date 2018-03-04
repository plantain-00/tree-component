const webpack = require('webpack')

module.exports = {
  entry: './packages/react/demo/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  }
}
