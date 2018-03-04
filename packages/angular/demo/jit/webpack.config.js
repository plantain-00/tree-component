const webpack = require('webpack')

module.exports = {
  entry: './packages/angular/demo/jit/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  }
}
