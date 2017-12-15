const webpack = require('webpack')
const path = require('path')

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false
    },
    exclude: [
    ]
  })
]

const resolve = {
  alias: {
    'vue$': 'vue/dist/vue.esm.js'
  }
}

module.exports = [
  {
    entry: './packages/vue/demo/index',
    output: {
      path: path.resolve(__dirname, 'packages/vue/demo'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './packages/react/demo/index',
    output: {
      path: path.resolve(__dirname, 'packages/react/demo'),
      filename: 'index.bundle.js'
    },
    plugins
  },
  {
    entry: './packages/angular/demo/jit/index',
    output: {
      path: path.resolve(__dirname, 'packages/angular/demo/jit'),
      filename: 'index.bundle.js'
    },
    plugins
  },
  {
    entry: './packages/angular/demo/aot/index',
    output: {
      path: path.resolve(__dirname, 'packages/angular/demo/aot'),
      filename: 'index.bundle.js'
    },
    plugins
  }
]
