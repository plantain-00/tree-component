const childProcess = require('child_process')
const util = require('util')
const { Service } = require('clean-scripts')

const execAsync = util.promisify(childProcess.exec)

const tsFiles = `"src/**/*.ts" "src/**/*.tsx" "spec/**/*.ts" "demo/**/*.ts" "demo/**/*.tsx" "screenshots/**/*.ts"`
const lessFiles = `"src/**/*.less"`
const jsFiles = `"*.config.js"`

module.exports = {
  build: [
    `rimraf dist`,
    `mkdirp dist`,
    {
      js: [
        {
          vue: `file2variable-cli src/angular-node.template.html src/angular-tree.template.html -o src/angular-variables.ts --html-minify --base src`,
          angular: `file2variable-cli src/vue-node.template.html src/vue-tree.template.html -o src/vue-variables.ts --html-minify --base src`
        },
        `ngc -p src`,
        `tsc -p demo`,
        `webpack --display-modules --config demo/webpack.config.js`
      ],
      css: [
        `image2base64-cli images/*.png images/*.gif --less src/variables.less --base images`,
        [
          `lessc src/tree.less > src/tree.css`,
          `postcss src/tree.css -o dist/tree.css`,
          `cleancss -o dist/tree.min.css dist/tree.css`,
          `cleancss -o demo/index.bundle.css dist/tree.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`
        ]
      ],
      clean: `rimraf demo/**/index.bundle-*.js demo/tree-icon-*.png demo/index.bundle-*.css`
    },
    `rev-static --config demo/rev-static.config.js`
  ],
  lint: {
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles} --exclude "src/compiled/**/*"`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(`generated files doesn't match.`)
      }
    }
  ],
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`,
    less: `stylelint --fix ${lessFiles}`
  },
  release: `clean-release`,
  watch: {
    vue: `file2variable-cli src/angular-node.template.html src/angular-tree.template.html -o src/angular-variables.ts --html-minify --base src --watch`,
    angular: `file2variable-cli src/vue-node.template.html src/vue-tree.template.html -o src/vue-variables.ts --html-minify --base src --watch`,
    src: `tsc -p src --watch`,
    demo: `tsc -p demo --watch`,
    webpack: `webpack --config demo/webpack.config.js --watch`,
    image: `image2base64-cli images/*.png images/*.gif --less src/variables.less --base images --watch`,
    less: `watch-then-execute "src/*.less" --script "clean-scripts build[2].css[1]"`,
    rev: `rev-static --config demo/rev-static.config.js --watch`
  },
  screenshot: [
    new Service(`http-server -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
