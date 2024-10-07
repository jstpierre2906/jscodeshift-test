const cssTransformer = ({ ast, transformers }) => {
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
  const recurseThroughCSSTree = ({ node }) => {
    if (node.selector) {
      locateAndTransform({ node });
    }
    if (node.nodes && Array.isArray(node.nodes)) {
      node.nodes.forEach((nodeContent) => {
        locateAndTransform({ node: nodeContent });
        recurseThroughCSSTree({ node: nodeContent });
      });
    }
  };
  ast.nodes.forEach((firstLevelNode) => recurseThroughCSSTree({ node: firstLevelNode }));
  return ast;
};

module.exports = cssTransformer;
