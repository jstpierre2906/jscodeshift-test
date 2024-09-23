const fs = require("node:fs");
const path = require("node:path");
const { parser } = require("posthtml-parser");
const jscodeshift = require("jscodeshift");

const htmlFile = fs.readFileSync(`${__dirname}/../examples/html/example-markup.html`, "utf-8");
const ast = parser(htmlFile)[0];
console.log(ast); // { tag: 'div', attrs: { class: 'red' }, content: [ 'Just a div' ] }

const transformAST = () => {
  const j = jscodeshift; //.withParser("recast");
  // jscodeshift complains about receiving an unexpected value [object Object]
  // The AST might not be formed to what jscodeshift expects
  // Maybe doing manual transforms with vanilla JS is the way to go, since
  // the transforms themselves are done that way.
  //
  // Edit: since we have to rebuild the HTML after transformation,
  // we have to somehow get the AST accepted by jscodeshift.
  const root = j(ast);
  return root.toSource();
};

const transformed = transformAST();
console.log(transformed);
