const webpack = require('webpack')

module.exports = {
  entry: './packages/angular/demo/aot/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  }
}
