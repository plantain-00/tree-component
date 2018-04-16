module.exports = {
  mode: process.env.NODE_ENV,
  entry: './packages/angular/demo/jit/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  }
}
