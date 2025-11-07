import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    nodePolyfills(),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: { declaration: false },
      check: false,
      clean: true
    })
  ],
  external: [
    'axios',
    'js-sha3',
    'bs58',
    'big-integer',
    'int64-buffer',
    'elliptic',
    'ethers',
  ],
};
