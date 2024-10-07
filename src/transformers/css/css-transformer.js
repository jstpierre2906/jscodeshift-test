const locateAndTransform = require("../common-css-html/locate-and-transform.js");

const cssTransformer = ({ ast, transformers }) => {
  const recurseThroughCSSTree = ({ node }) => {
    if (node.selector || node.prop) {
      locateAndTransform({ node, transformers });
    }
    if (Array.isArray(node?.nodes)) {
      node.nodes.forEach((nodeContent) => {
        locateAndTransform({ node: nodeContent, transformers });
        recurseThroughCSSTree({ node: nodeContent });
      });
    }
  };
  ast.nodes.forEach((firstLevelNode) => recurseThroughCSSTree({ node: firstLevelNode }));
  return ast;
};

module.exports = cssTransformer;
