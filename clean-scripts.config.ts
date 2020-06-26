import { executeScriptAsync } from 'clean-scripts'
import { watch } from 'watch-then-execute'

const tsFiles = `"packages/@(core|vue|react)/@(src|demo)/**/*.@(ts|tsx)"`
const lessFiles = `"packages/core/src/**/*.less"`
const excludeTsFiles = `"packages/@(core|vue|react)/@(src|demo)/**/*.@(d|config).ts"`

const vueTemplateCommand = `file2variable-cli --config packages/vue/src/file2variable.config.ts`
const tscCoreSrcCommand = `tsc -p packages/core/src`
const tscVueSrcCommand = `tsc -p packages/vue/src`
const tscReactSrcCommand = `tsc -p packages/react/src`

const webpackVueCommand = `webpack --config packages/vue/demo/webpack.config.ts`
const webpackReactCommand = `webpack --config packages/react/demo/webpack.config.ts`

const revStaticCommand = `rev-static`
const cssCommand = [
  `lessc packages/core/src/tree.less > packages/core/src/tree.css`,
  `postcss packages/core/src/tree.css -o packages/core/dist/tree.css`,
  `cleancss packages/core/dist/tree.css -o packages/core/dist/tree.min.css`,
  `cleancss packages/core/dist/tree.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css -o packages/core/demo/index.bundle.css`
]
const image2base64Command = `image2base64-cli "packages/core/src/images/*.@(png|gif)" --less "packages/core/src/variables.less" --base "packages/core/src/images"`

const isDev = process.env.NODE_ENV === 'development'

export default {
  build: [
    {
      js: [
        tscCoreSrcCommand,
        {
          vue: [
            vueTemplateCommand,
            tscVueSrcCommand,
            isDev ? undefined : `rollup --config packages/vue/src/rollup.config.js`,
            webpackVueCommand
          ],
          react: [
            tscReactSrcCommand,
            isDev ? undefined : `rollup --config packages/react/src/rollup.config.js`,
            webpackReactCommand
          ]
        }
      ],
      css: [
        image2base64Command,
        cssCommand
      ],
      clean: `rimraf "packages/@(core|vue|react)/demo/**/@(*.bundle-*.js|*.bundle-*.css)"`
    },
    revStaticCommand
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export "packages/@(core|vue|react)/src/**/*.@(ts|tsx)" ${lessFiles} --strict --need-module tslib --exclude ${excludeTsFiles}`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'lerna exec -- type-coverage -p src --strict'
  },
  test: [
  ],
  fix: {
    ts: `eslint --ext .js,.ts ${tsFiles} --fix`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    vueTemplateCommand: `${vueTemplateCommand} --watch`,
    tscCoreSrcCommand: `${tscCoreSrcCommand} --watch`,
    tscVueSrcCommand: `${tscVueSrcCommand} --watch`,
    tscReactSrcCommand: `${tscReactSrcCommand} --watch`,
    webpackVueCommand: `${webpackVueCommand} --watch`,
    webpackReactCommand: `${webpackReactCommand} --watch`,
    image: `${image2base64Command} --watch`,
    less: () => watch(['src/**/*.less'], [], () => executeScriptAsync(cssCommand)),
    rev: `${revStaticCommand} --watch`
  }
}
