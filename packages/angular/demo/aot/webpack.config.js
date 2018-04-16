module.exports = {
  mode: process.env.NODE_ENV,
  entry: './packages/angular/demo/aot/index',
  output: {
    path: __dirname,
    filename: 'index.bundle.js'
  }
}
