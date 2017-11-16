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
    'vue$': 'vue/dist/vue.min.js'
  }
}

module.exports = [
  {
    entry: './demo/vue/index',
    output: {
      path: path.resolve(__dirname, 'vue'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/react/index',
    output: {
      path: path.resolve(__dirname, 'react'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/angular/index',
    output: {
      path: path.resolve(__dirname, 'angular'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/aot/index',
    output: {
      path: path.resolve(__dirname, 'aot'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  }
]
