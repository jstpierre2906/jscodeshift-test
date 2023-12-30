/**
 * Refs
 * https://www.dhiwise.com/post/the-ultimate-guide-to-using-jscodeshift-with-typescript
 *
 * https://astexplorer.net/ with 'recast' parser
 *
 */
const basicTransformer = (fileInfo, api, _options) => {
  const j = api.jscodeshift;
  // Abstract Syntax Tree, a.k.a ast
  const ast = j(fileInfo.source);

  // Rename variable 'foo' as 'bar', e.g. when we know the name of the var, a.k.a the Identifier
  ast.find(j.Identifier, { name: "foo" }).replaceWith((path) => j.identifier("bar"));

  // Traversing the file:
  // Rename 'cat' as 'Cat' and 'dog' as 'Dog'
  // in 'const TYPE_CAT = "cat";', 'const TYPE_DOG = "dog";' variableDeclaration
  ast
    .find(j.VariableDeclaration)
    .filter(
      (path) => !!path.node.declarations.find((d) => ["TYPE_CAT", "TYPE_DOG"].includes(d.id.name))
    )
    .forEach((path) => {
      const toSentenceCase = (str) => `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`;
      path.node.declarations.forEach((d) => (d.init.value = toSentenceCase(d.init.value)));
    });

  return ast.toSource();
};

module.exports = basicTransformer;
