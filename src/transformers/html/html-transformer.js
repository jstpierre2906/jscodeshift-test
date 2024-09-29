const htmlTransformer = ({ ast, nodeTargetPredicate, nodeTargetTransformer }) => {
  const attemptTransform = ({ node }) => {
    try {
      nodeTargetTransformer(node);
    } catch (error) {
      console.error(error);
    }
  };
  const recurseThroughHTMLTree = ({ node }) => {
    if (node.tag && node.content) {
      if (nodeTargetPredicate(node)) {
        attemptTransform({ node });
      }
      if (Array.isArray(node.content)) {
        node.content.forEach((nodeContentItem) => {
          if (nodeTargetPredicate(nodeContentItem)) {
            attemptTransform({ node: nodeContentItem });
          }
          recurseThroughHTMLTree({ node: nodeContentItem });
        });
      }
    }
  };
  ast.forEach((firstLevelNode) => recurseThroughHTMLTree({ node: firstLevelNode }));
  return ast;
};

module.exports = htmlTransformer;
