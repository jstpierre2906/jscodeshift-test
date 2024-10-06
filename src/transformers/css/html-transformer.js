const htmlTransformer = ({ ast, transformers }) => {
  const locateAndTransform = ({ node }) => {
    transformers
      .filter((t) => t.nodeTargetPredicate(node))
      .forEach((t) => {
        try {
          t.nodeTargetTransformer(node);
        } catch (error) {
          console.error(error);
        }
      });
  };
  const recurseThroughHTMLTree = ({ node }) => {
    if (node.tag && node.content) {
      locateAndTransform({ node });
      if (Array.isArray(node.content)) {
        node.content.forEach((nodeContentItem) => {
          locateAndTransform({ node: nodeContentItem });
          recurseThroughHTMLTree({ node: nodeContentItem });
        });
      }
    }
  };
  ast.forEach((firstLevelNode) => recurseThroughHTMLTree({ node: firstLevelNode }));
  return ast;
};

module.exports = htmlTransformer;
