const webpack = require('webpack')

module.exports = {
  entry: './packages/angular/demo/jit/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  },
  plugins: [
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
}
