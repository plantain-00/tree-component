const { Service, execAsync, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = `"src/**/*.ts" "src/**/*.tsx" "spec/**/*.ts" "demo/**/*.ts" "demo/**/*.tsx" "screenshots/**/*.ts"`
const lessFiles = `"src/**/*.less"`
const jsFiles = `"*.config.js" "demo/*.config.js" "spec/**/*.config.js"`

const vueTemplateCommand = `file2variable-cli src/angular-node.template.html src/angular-tree.template.html -o src/angular-variables.ts --html-minify --base src`
const angularTemplateCommand = `file2variable-cli src/vue-node.template.html src/vue-tree.template.html -o src/vue-variables.ts --html-minify --base src`
const ngcSrcCommand = [
  `tsc -p src`,
  `ngc -p src/tsconfig.aot.json`
]
const tscDemoCommand = `tsc -p demo`
const webpackCommand = `webpack --display-modules --config demo/webpack.config.js`
const image2base64Command = `image2base64-cli images/*.png images/*.gif --less src/variables.less --base images`
const revStaticCommand = `rev-static --config demo/rev-static.config.js`
const cssCommand = [
  `lessc src/tree.less > src/tree.css`,
  `postcss src/tree.css -o dist/tree.css`,
  `cleancss -o dist/tree.min.css dist/tree.css`,
  `cleancss -o demo/index.bundle.css dist/tree.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`
]

module.exports = {
  build: [
    `rimraf dist`,
    `mkdirp dist`,
    {
      js: [
        {
          vue: vueTemplateCommand,
          angular: angularTemplateCommand
        },
        ngcSrcCommand,
        tscDemoCommand,
        webpackCommand
      ],
      css: [
        image2base64Command,
        cssCommand
      ],
      clean: `rimraf demo/**/index.bundle-*.js demo/tree-icon-*.png demo/index.bundle-*.css`
    },
    revStaticCommand
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
    vue: `${vueTemplateCommand} --watch`,
    angular: `${angularTemplateCommand} --watch`,
    src: `${ngcSrcCommand} --watch`,
    demo: `${tscDemoCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    image: `${image2base64Command} --watch`,
    less: () => watch(['src/**/*.less'], [], () => executeScriptAsync(cssCommand)),
    rev: `${revStaticCommand} --watch`
  },
  screenshot: [
    new Service(`http-server -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
