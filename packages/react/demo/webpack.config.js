module.exports = {
  mode: process.env.NODE_ENV,
  entry: './packages/react/demo/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  }
}
