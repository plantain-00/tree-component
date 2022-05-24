import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'packages/vue/dist/index.js',
  plugins: [
    resolve({ browser: true }),
    terser(),
    commonjs()
  ],
  output: {
    name: 'Tree',
    file: 'packages/vue/dist/tree-vue-component.min.js',
    format: 'umd'
  },
  external: [
    'vue'
  ]
}
