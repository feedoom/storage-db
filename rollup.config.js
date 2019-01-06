import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import regenerator from 'rollup-plugin-regenerator';
// import async from 'rollup-plugin-async';

export default {
  input: 'src/storageDB.js',
  output: {
    file: 'dist/storage.js',
    format: 'umd',
    name: 'StorageDB',
  },
  plugins: [
    resolve(),
    // async(),
    babel({
      exclude: 'node_modules/**',
    }),
    regenerator(),
  ],
};