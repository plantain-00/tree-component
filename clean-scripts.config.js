module.exports = {
  build: [
    `file2variable-cli src/angular-node.template.html src/angular-tree.template.html -o src/angular-variables.ts --html-minify --base src`,
    `file2variable-cli src/vue-node.template.html src/vue-tree.template.html -o src/vue-variables.ts --html-minify --base src`,
    `rimraf dist`,
    `tsc -p src`,
    `tsc -p demo`,
    `image2base64-cli images/*.png images/*.gif --less src/variables.less --base images`,
    `lessc src/tree.less > dist/tree.css`,
    `cleancss -o dist/tree.min.css dist/tree.css`,
    `cleancss -o demo/index.bundle.css dist/tree.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`,
    `webpack --display-modules --config demo/webpack.config.js`,
    `rimraf demo/**/index.bundle-*.js demo/tree-icon-*.png demo/index.bundle-*.css`,
    `rev-static --config demo/rev-static.config.js`
  ],
  lint: [
    `tslint "src/*.ts" "src/*.tsx" "demo/**/*.ts" "demo/**/*.tsx"`,
    `standard "**/*.config.js"`,
    `stylelint "src/**/*.less"`
  ],
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js'
  ],
  fix: [
    `standard --fix "**/*.config.js"`
  ],
  release: [
    `clean-release`
  ]
}
