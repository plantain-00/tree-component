module.exports = {
  mode: process.env.NODE_ENV,
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
