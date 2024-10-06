// @ts-nocheck
const fs = require("node:fs");
// const { parser: postHTMLParser } = require("posthtml-parser");
// const { render: postHTMLRender } = require("posthtml-render");
const postcss = require("postcss");

const htmlTransformer = require("./html-transformer.js");

const file = `${__dirname}/../../examples/css/style.css`;
const fileContent = fs.readFileSync(file, { encoding: "utf-8" });

const ast = postcss.parse(fileContent);
// console.log(ast.nodes);
// console.log(ast.nodes[0]);
// console.log(ast.nodes[0].nodes);
// console.log(ast.nodes[0].nodes[0]);
// console.log(ast.nodes[0].nodes[1].selector);
// console.log(ast.nodes[0].selector);
// console.log(ast.nodes[0].nodes[0].value);
// ast.nodes[0].nodes[0].value = "red";
// console.log(ast.nodes[0].nodes[0].value);

const predicate = (node) => {
  return (
    node.type === "rule" &&
    node.selector === ".red-sector-a" &&
    !!(() => {
      return node?.nodes.filter((secondLevelNode) => {
        return (
          secondLevelNode.type === "rule" &&
          secondLevelNode.selector === ".distant-early-warning" &&
          secondLevelNode?.nodes.filter((thirdLevelNode) => {
            return thirdLevelNode.type === "rule" && thirdLevelNode.selector === ".kid-gloves";
          })
        );
      });
    })()
  );
};

console.log(predicate(ast.nodes[0]));

// const transformedAST = htmlTransformer({
//   ast: postcss.parse(fileContent),
//   transformers: [
//     {
//       nodeTargetPredicate: (node) => node.selector === ".red-sector-a" && node.attrs.class === "red",
//       nodeTargetTransformer: (node) => {
//         node.tag = "section";
//         node.attrs.class = "blue";
//         node.content[0] = {
//           tag: "span",
//           attrs: { class: "some-stylin" },
//           content: "works!",
//         };
//       },
//     },
//   ],
// });
// const modifiedHTML = postHTMLRender(transformedAST, { closingSingleTag: "slash" });
// console.log(modifiedHTML);
// fs.writeFileSync(file, modifiedHTML, { encoding: "utf-8" });
