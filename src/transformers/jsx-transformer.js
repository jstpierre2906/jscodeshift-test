const jsxTransformer = (fileInfo, api, _options) => {
  const j = api.jscodeshift;
  // Abstract Syntax Tree, a.k.a ast
  const ast = j(fileInfo.source);
  return ast
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: "div",
        },
      },
    })
    .forEach((path) => {
      path.node.openingElement.name.name = "section";
      if (path.node.closingElement) {
        path.node.closingElement.name.name = "section";
      }
    })
    .toSource();
};

module.exports = jsxTransformer;
