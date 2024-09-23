const { run: jscodeshift } = require("jscodeshift/src/Runner");
const path = require("node:path");

const transformPath = path.resolve("src/transformers/basic-transformer.js");
const paths = ["src/examples/js/example-code.js"];
const options = {
  dry: false,
  print: false,
  verbose: 0,
};

const res = jscodeshift(transformPath, paths, options).then((result) => console.log(result));

/**
 * Processing 1 files...
 * Spawning 1 workers...
 * Sending 1 files to free worker...
 * All done.
 * Results:
 * 0 errors
 * 0 unmodified
 * 0 skipped
 * 1 ok
 * Time elapsed: 0.226seconds
 * {
 *   stats: {},
 *   timeElapsed: '0.226',
 *   error: 0,
 *   ok: 1,
 *   nochange: 0,
 *   skip: 0
 * }
 */
