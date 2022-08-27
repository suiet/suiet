import resolvePlugin from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import cjs2es from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";
import {defineConfig} from "rollup";
import { babel } from '@rollup/plugin-babel';
import * as path from "path";

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'es',
    dir: 'dist',
  },
  plugins: [
    nodePolyfills(),
    resolvePlugin({
      browser: true,
    }),
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    cjs2es(), // must place before babel
    babel({
      babelHelpers: 'bundled'
    }),
    json(),
  ]
})