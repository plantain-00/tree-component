const { Service, checkGitStatus, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = `"packages/@(core|vue|react|angular)/@(src|demo)/**/*.@(ts|tsx)" "spec/**/*.ts" "screenshots/**/*.ts"`
const lessFiles = `"packages/core/src/**/*.less"`
const jsFiles = `"*.config.js" "spec/**/*.config.js"`
const excludeTsFiles = `"packages/@(core|vue|react|angular)/@(src|demo)/**/*.d.ts"`

const vueTemplateCommand = `file2variable-cli --config packages/vue/src/file2variable.config.js`
const angularTemplateCommand = `file2variable-cli packages/angular/src/*.template.html -o packages/angular/src/variables.ts --html-minify --base packages/angular/src`
const tscCoreSrcCommand = `ngc -p packages/core/src`
const tscVueSrcCommand = `tsc -p packages/vue/src`
const tscReactSrcCommand = `tsc -p packages/react/src`
const tscAngularSrcCommand = `ngc -p packages/angular/src`

const tscCoreDemoCommand = `ngc -p packages/core/demo`
const tscVueDemoCommand = `tsc -p packages/vue/demo`
const tscReactDemoCommand = `tsc -p packages/react/demo`
const tscAngularDemoCommand = `ngc -p packages/angular/demo`
const webpackCommand = `webpack`
const revStaticCommand = `rev-static`
const cssCommand = [
  `lessc packages/core/src/tree.less > packages/core/src/tree.css`,
  `postcss packages/core/src/tree.css -o packages/core/dist/tree.css`,
  `cleancss packages/core/dist/tree.css -o packages/core/dist/tree.min.css`,
  `cleancss packages/core/dist/tree.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css -o packages/core/demo/index.bundle.css`
]
const image2base64Command = `image2base64-cli "packages/core/src/images/*.@(png|gif)" --less "packages/core/src/variables.less" --base "packages/core/src/images"`

module.exports = {
  build: [
    {
      js: [
        {
          vueTemplateCommand,
          angularTemplateCommand
        },
        tscCoreSrcCommand,
        {
          tscVueSrcCommand,
          tscReactSrcCommand,
          tscAngularSrcCommand
        },
        tscCoreDemoCommand,
        {
          tscVueDemoCommand,
          tscReactDemoCommand,
          tscAngularDemoCommand
        },
        webpackCommand
      ],
      css: [
        image2base64Command,
        cssCommand
      ],
      clean: `rimraf "packages/@(core|vue|react|angular)/demo/**/@(*.bundle-*.js|*.bundle-*.css)"`
    },
    revStaticCommand
  ],
  lint: {
    ts: `tslint ${tsFiles} --exclude ${excludeTsFiles}`,
    js: `standard ${jsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles} --exclude ${excludeTsFiles}`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    () => checkGitStatus()
  ],
  fix: {
    ts: `tslint --fix ${tsFiles} --exclude ${excludeTsFiles}`,
    js: `standard --fix ${jsFiles}`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    vueTemplateCommand: `${vueTemplateCommand} --watch`,
    angularTemplateCommand: `${angularTemplateCommand} --watch`,
    tscCoreSrcCommand: `${tscCoreSrcCommand} --watch`,
    tscVueSrcCommand: `${tscVueSrcCommand} --watch`,
    tscReactSrcCommand: `${tscReactSrcCommand} --watch`,
    tscAngularSrcCommand: `${tscAngularSrcCommand} --watch`,
    tscCoreDemoCommand: `${tscCoreDemoCommand} --watch`,
    tscVueDemoCommand: `${tscVueDemoCommand} --watch`,
    tscReactDemoCommand: `${tscReactDemoCommand} --watch`,
    tscAngularDemoCommand: `${tscAngularDemoCommand} --watch`,
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
