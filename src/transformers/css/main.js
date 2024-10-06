// @ts-nocheck
const fs = require("node:fs");
// const { parser: postHTMLParser } = require("posthtml-parser");
// const { render: postHTMLRender } = require("posthtml-render");
const postcss = require("postcss");

const cssTransformer = require("./css-transformer.js");

const file = `${__dirname}/../../examples/css/style.css`;
const fileContent = fs.readFileSync(file, { encoding: "utf-8" });

const ast = postcss.parse(fileContent);
console.log(ast.nodes);
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

// ast.nodes[0].nodes
//   .filter((n) => n.type === "decl")
//   .forEach((n) => {
//     console.log(n);
//     console.log(n.prop);
//     console.log(n.value);
//   });

const transformedAST = cssTransformer({
  ast: postcss.parse(fileContent),
  transformers: [
    {
      nodeTargetPredicate: (node) => {
        return (
          node.type === "rule" &&
          node.selector === ".red-sector-a" &&
          !!(() => {
            return node?.nodes.filter((secondLevelNode) => {
              return (
                secondLevelNode.type === "rule" &&
                secondLevelNode.selector === ".distant-early-warning" &&
                secondLevelNode?.nodes.filter((thirdLevelNode) => {
                  return (
                    thirdLevelNode.type === "rule" && thirdLevelNode.selector === ".kid-gloves"
                  );
                })
              );
            });
          })()
        );
      },
      nodeTargetTransformer: (node) => {
        let fontSizeDecl;
        if (
          undefined !==
          (fontSizeDecl = node.nodes.find((n) => n.type === "decl" && n.prop === "font-size"))
        ) {
          fontSizeDecl.value = "2em";
        }
      },
    },
  ],
});
// const modifiedHTML = postHTMLRender(transformedAST, { closingSingleTag: "slash" });
// console.log(modifiedHTML);
// fs.writeFileSync(file, modifiedHTML, { encoding: "utf-8" });
