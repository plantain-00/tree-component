module.exports = {
  inputFiles: [
    'demo/**/index.bundle.js',
    'demo/**/index.ejs.html',
    'demo/*.bundle.css',
    'demo/tree-icon.png'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  json: false,
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  base: 'demo',
  fileSize: 'demo/file-size.json'
}
