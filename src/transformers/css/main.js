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
            return (
              Array.isArray(node?.nodes) &&
              node.nodes.filter((secondLevelNode) => {
                return (
                  secondLevelNode.type === "rule" &&
                  secondLevelNode.selector === ".distant-early-warning" &&
                  Array.isArray(secondLevelNode?.nodes) &&
                  secondLevelNode.nodes.filter((thirdLevelNode) => {
                    return (
                      thirdLevelNode?.type === "rule" && thirdLevelNode?.selector === ".kid-gloves"
                    );
                  })
                );
              })
            );
          })()
        );
      },
      nodeTargetTransformer: (node) => {
        const distantEarlyWarningRule = node.nodes.find((n) => {
          return n.type === "rule" && n.selector === ".distant-early-warning";
        });
        const modifications = {
          redSectorAFontSize: () => {
            const fontSizeDecl = node.nodes.find(
              (n) => n.type === "decl" && n.prop === "font-size"
            );
            fontSizeDecl.value = "2em";
          },
          distantEarlyWarningColor: () => {
            const colorDecl = distantEarlyWarningRule.nodes.find((n) => {
              return n.type === "decl" && n.prop === "color";
            });
            colorDecl.value = "red";
          },
          kidGlovesFontWeight: () => {
            const kidGlovesRule = distantEarlyWarningRule.nodes.find((n) => {
              return n.type === "rule" && n.selector === ".kid-gloves";
            });
            const fontWeightDecl = kidGlovesRule.nodes.find((n) => {
              return n.type === "decl" && n.prop === "font-weight";
            });
            fontWeightDecl.value = "normal";
          },
        };
        Object.keys(modifications).forEach((key) => modifications[key]());
      },
    },
  ],
});
const modifiedCSS = transformedAST.toString();
console.log(modifiedCSS);
fs.writeFileSync(file, modifiedCSS, { encoding: "utf-8" });
