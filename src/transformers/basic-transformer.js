/**
 * Refs
 * https://www.dhiwise.com/post/the-ultimate-guide-to-using-jscodeshift-with-typescript
 *
 * https://astexplorer.net/ with 'recast' parser
 *
 */

const utils = {
  toSentenceCase: (str) => `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`,
};

const basicTransformer = (fileInfo, api, _options) => {
  const j = api.jscodeshift;
  // Abstract Syntax Tree, a.k.a ast
  const ast = j(fileInfo.source);

  // Rename variable 'foo' as 'bar', e.g. when we know the name of the var, a.k.a the Identifier
  ast.find(j.Identifier, { name: "foo" }).replaceWith((path) => j.identifier("bar"));

  // Traversing the file:
  //
  // Rename 'cat' as 'Cat' and 'dog' as 'Dog'
  // in 'const TYPE_CAT = "cat";', 'const TYPE_DOG = "dog";' variableDeclaration
  //
  // Example of path.node.declarations (unfiltered)
  // [
  //   Node {
  //     type: 'VariableDeclarator',
  //     start: 100,
  //     end: 116,
  //     loc: SourceLocation {
  //       start: [Position],
  //       end: [Position],
  //       filename: undefined,
  //       identifierName: undefined,
  //       lines: [Lines],
  //       tokens: [Array],
  //       indent: 0
  //     },
  //     id: Node {
  //       type: 'Identifier',
  //       start: 100,
  //       end: 108,
  //       loc: [SourceLocation],
  //       name: 'TYPE_CAT',
  //       optional: false,
  //       typeAnnotation: null
  //     },
  //     init: Node {
  //       type: 'Literal',
  //       start: 111,
  //       end: 116,
  //       loc: [SourceLocation],
  //       value: 'cat',
  //       raw: '"cat"'
  //     }
  //   }
  // ]

  ast
    .find(j.VariableDeclaration)
    .filter(
      (path) => !!path.node.declarations.find((d) => ["TYPE_CAT", "TYPE_DOG"].includes(d.id.name))
    )
    .forEach((path) => {
      path.node.declarations.forEach((d) => (d.init.value = utils.toSentenceCase(d.init.value)));
    });

  return ast.toSource();
};

/**
 * Processing 1 files...
 * Spawning 1 workers...
 * Sending 1 files to free worker...
 * All done.
 * Results:
 * 0 errors
 * 0 unmodified
 * 0 skipped
 * 1 ok
 * Time elapsed: 0.226seconds
 * {
 *   stats: {},
 *   timeElapsed: '0.226',
 *   error: 0,
 *   ok: 1,
 *   nochange: 0,
 *   skip: 0
 * }
 */

module.exports = basicTransformer;
