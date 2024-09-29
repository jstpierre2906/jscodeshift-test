const recurseThroughHTMLTree = require("./utils/recurse.js");

const htmlTransformer = ({ ast, nodeTargetPredicate, nodeTargetTransformer }) => {
  ast.forEach((firstLevelNode) =>
    recurseThroughHTMLTree({
      node: firstLevelNode,
      nodeTargetPredicate,
      nodeTargetTransformer,
    })
  );
  return ast;
};

module.exports = htmlTransformer;
