const webpack = require('webpack')

module.exports = {
  entry: './packages/vue/demo/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
