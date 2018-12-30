import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'packages/react/dist/index.js',
  plugins: [
    resolve({ browser: true }),
    uglify(),
    commonjs()
  ],
  output: {
    name: 'Tree',
    file: 'packages/react/dist/tree-react-component.min.js',
    format: 'umd'
  },
  external: [
    'react',
    'react-dom'
  ]
}
