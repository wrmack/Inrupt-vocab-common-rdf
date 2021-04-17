// import { nodeResolve } from "@rollup/plugin-node-resolve";
// import commonjs from '@rollup/plugin-commonjs';

export default {
  input: "./node_modules/@inrupt/vocab-common-rdf/dist/index.es.js",
  output: [
    {
      file: "vocab-common-rdf.bundle.js",
      format: "iife",
      name: "SolidRdf",
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    // nodeResolve({preferBuiltins: false, browser: true}),
    // commonjs(),
  ],
};