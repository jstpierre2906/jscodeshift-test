const attemptTransform = require("./transform.js");

const recurseThroughHTMLTree = ({ node, nodeTargetPredicate, nodeTargetTransformer }) => {
  if (node.tag && node.content) {
    if (nodeTargetPredicate(node)) {
      attemptTransform({ node, nodeTargetTransformer });
    }
    if (Array.isArray(node.content)) {
      node.content.forEach((nodeContentItem) => {
        if (nodeTargetPredicate(nodeContentItem)) {
          attemptTransform({ node: nodeContentItem, nodeTargetTransformer });
        }
        recurseThroughHTMLTree({
          node: nodeContentItem,
          nodeTargetPredicate,
          nodeTargetTransformer,
        });
      });
    }
  }
};

module.exports = recurseThroughHTMLTree;
