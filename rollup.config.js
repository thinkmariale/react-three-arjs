
import commonjs from "@rollup/plugin-commonjs";
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import packageJson from './package.json' 
import resolve from '@rollup/plugin-node-resolve';
import {babel} from '@rollup/plugin-babel';

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      babel(),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      terser(),
     
    ],
    external: ["react", "react-dom"]
  }
]
