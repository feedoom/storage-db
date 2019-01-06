import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import regenerator from 'rollup-plugin-regenerator';
// import async from 'rollup-plugin-async';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const plugins = [
  resolve(),
  uglify(),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
  }),
  regenerator(),
];

export default [
  {
    input: 'src/storageDB.js',
    output: {
      file: 'lib/storage.js',
      format: 'umd',
      name: 'StorageDB',
    },
    plugins,
  },
  // {
  //   input: 'src/core/storage.js',
  //   output: {
  //     file: 'lib/storage-little.js',
  //     format: 'umd',
  //     name: 'StorageDB',
  //   },
  //   plugins,
  // }
];