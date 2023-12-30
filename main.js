/**
 * Install: npm install -g jscodeshift
 */

const { run: jscodeshift } = require("jscodeshift/src/Runner");
const path = require("node:path");

const transformPath = path.resolve("src/transformers/basic-transformer.js");
const paths = ["src/examples/some-example-code.js"]; // <-- glob isn't supported
const options = {
  dry: false,
  print: false,
  verbose: 0,
};

const res = jscodeshift(transformPath, paths, options).then((result) => console.log(result));

/**
 * {
 *   stats: {},
 *   timeElapsed: '0.237',
 *   error: 0,
 *   ok: 0,
 *   nochange: 1,
 *   skip: 0
 * }
 */
