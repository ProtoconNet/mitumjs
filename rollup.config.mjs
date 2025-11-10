import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const commonPlugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    include: /node_modules/,
    requireReturnsDefault: 'auto',
  }),
  nodePolyfills(),
  json(),
  typescript({
    tsconfig: './tsconfig.json',
    tsconfigOverride: { declaration: false },
    check: false,
    clean: true,
  }),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.cjs.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: commonPlugins,
    external: [
      'axios',
      'js-sha3',
      'bs58',
      'big-integer',
      'int64-buffer',
      'ethers',
      'buffer',
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.esm.mjs',
      format: 'esm',
      sourcemap: true,
    },
    plugins: commonPlugins,
    external: [
      'axios',
      'ethers',
    ],
  },
];
