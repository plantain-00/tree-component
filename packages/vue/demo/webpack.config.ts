import * as webpack from 'webpack'

export default {
  mode: process.env.NODE_ENV,
  entry: './packages/vue/demo/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js'
    }
  }
} as webpack.Configuration
