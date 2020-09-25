import { ConfigData } from 'rev-static'

const config: ConfigData = {
  inputFiles: [
    'packages/@(vue|react)/demo/**/*.bundle.js',
    'packages/@(vue|react)/demo/**/*.ejs.html',
    'packages/core/demo/*.bundle.css',
    'packages/core/demo/tree-icon.png'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  base: 'packages',
  fileSize: 'file-size.json'
}

export default config
