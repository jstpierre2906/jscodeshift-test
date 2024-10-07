// @ts-nocheck
const fs = require("node:fs");
const postcss = require("postcss");

const cssTransformer = require("./css-transformer.js");

const file = `${__dirname}/../../examples/css/style.css`;
const fileContent = fs.readFileSync(file, { encoding: "utf-8" });

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
        const fontSizeDecl = node.nodes.find((n) => n.type === "decl" && n.prop === "font-size");
        fontSizeDecl && (fontSizeDecl.value = "2em");
      },
    },
  ],
});
const modifiedCSS = transformedAST.toString();
console.log(modifiedCSS);
fs.writeFileSync(file, modifiedCSS, { encoding: "utf-8" });
