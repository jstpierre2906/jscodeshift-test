// @ts-nocheck
const fs = require("node:fs");
const postcss = require("postcss");

const cssTransformer = require("./css-transformer.js");

const file = `${__dirname}/../../examples/css/style.css`;
const fileContent = fs.readFileSync(file, { encoding: "utf-8" });

const TYPE_RULE = "rule";
const TYPE_DECLARATION = "decl";

const transformedAST = cssTransformer({
  ast: postcss.parse(fileContent),
  transformers: [
    {
      nodeTargetPredicate: (node) => {
        return (
          node.type === TYPE_RULE &&
          node.selector === ".red-sector-a" &&
          !!(() => {
            return (
              Array.isArray(node?.nodes) &&
              node.nodes.filter((secondLevelNode) => {
                return (
                  secondLevelNode.type === TYPE_RULE &&
                  secondLevelNode.selector === ".distant-early-warning" &&
                  Array.isArray(secondLevelNode?.nodes) &&
                  secondLevelNode.nodes.filter((thirdLevelNode) => {
                    return (
                      thirdLevelNode?.type === TYPE_RULE &&
                      thirdLevelNode?.selector === ".kid-gloves"
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
          return n.type === TYPE_RULE && n.selector === ".distant-early-warning";
        });
        const modifications = {
          redSectorAFontSize: (values) => {
            console.log("[INFO] redSectorAFontSize...");
            const fontSizeDecl = node.nodes.find(
              (n) => n.type === TYPE_DECLARATION && n.prop === "font-size"
            );
            fontSizeDecl.value = values.fontSize;
          },
          distantEarlyWarningColor: (values) => {
            console.log("[INFO] distantEarlyWarningColor...");
            const colorDecl = distantEarlyWarningRule.nodes.find((n) => {
              return n.type === TYPE_DECLARATION && n.prop === "color";
            });
            colorDecl.value = values.color;
          },
          kidGlovesFontWeight: (values) => {
            console.log("[INFO] kidGlovesFontWeight...");
            const kidGlovesRule = distantEarlyWarningRule.nodes.find((n) => {
              return n.type === TYPE_RULE && n.selector === ".kid-gloves";
            });
            const fontWeightDecl = kidGlovesRule.nodes.find((n) => {
              return n.type === TYPE_DECLARATION && n.prop === "font-weight";
            });
            fontWeightDecl.value = values.weight;
          },
        };
        const values = {
          redSectorAFontSize: { fontSize: "2em" },
          distantEarlyWarningColor: { color: "red" },
          kidGlovesFontWeight: { weight: "normal" },
        };
        Object.keys(modifications).forEach((key) => modifications[key](values[key]));
      },
    },
  ],
});
const modifiedCSS = transformedAST.toString();
console.log(modifiedCSS);
fs.writeFileSync(file, modifiedCSS, { encoding: "utf-8" });
