const attemptTransform = ({ node, nodeTargetTransformer }) => {
  try {
    nodeTargetTransformer(node);
  } catch (error) {
    console.error(error);
  }
};

module.exports = attemptTransform;
