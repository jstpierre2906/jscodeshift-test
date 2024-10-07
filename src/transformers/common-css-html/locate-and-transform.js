const locateAndTransform = ({ node, transformers }) => {
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

module.exports = locateAndTransform;
