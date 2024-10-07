const locateAndTransform = require("../common-css-html/locate-and-transform.js");

const htmlTransformer = ({ ast, transformers }) => {
  const recurseThroughHTMLTree = ({ node }) => {
    if (node.tag && node.content) {
      locateAndTransform({ node, transformers });
      if (Array.isArray(node.content)) {
        node.content.forEach((nodeContentItem) => {
          locateAndTransform({ node: nodeContentItem, transformers });
          recurseThroughHTMLTree({ node: nodeContentItem });
        });
      }
    }
  };
  ast.forEach((firstLevelNode) => recurseThroughHTMLTree({ node: firstLevelNode }));
  return ast;
};

module.exports = htmlTransformer;
