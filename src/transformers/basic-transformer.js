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

  // Renaming variable 'foo' as 'bar', e.g. when we know the name of the var, a.k.a the Identifier
  ast.find(j.Identifier, { name: "foo" }).replaceWith((path) => j.identifier("bar"));

  // Traversing the file:
  //
  // Examples of path.node.declarations (unfiltered)
  //
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
  //
  // [
  //   Node {
  //     type: 'VariableDeclarator',
  //     start: 220,
  //     end: 342,
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
  //       start: 220,
  //       end: 224,
  //       loc: [SourceLocation],
  //       name: 'cats',
  //       optional: false,
  //       typeAnnotation: null
  //     },
  //     init: Node {
  //       type: 'ArrayExpression',
  //       start: 227,
  //       end: 342,
  //       loc: [SourceLocation],
  //       extra: [Object],
  //       elements: [Array]
  //     }
  //   }
  // ]

  // Renaming 'cat' as 'Cat' and 'dog' as 'Dog'
  // in 'const TYPE_CAT = "cat";', 'const TYPE_DOG = "dog";' variableDeclaration
  ast
    .find(j.VariableDeclaration)
    .filter(
      (path) => !!path.node.declarations.find((d) => ["TYPE_CAT", "TYPE_DOG"].includes(d.id.name))
    )
    .forEach((path) => {
      path.node.declarations.forEach((d) => {
        d.init.value = utils.toSentenceCase(d.init.value);
        d.init.raw = `"${utils.toSentenceCase(d.init.value)}"`;
      });
    });

  // Renaming const 'cats' as 'animals'
  // Renaming 'animals' name key to upperCase,e.g. "Roxie", "Prumsche" and Zoë"
  ast
    .find(j.VariableDeclaration)
    .filter((path) => path.node.declarations.find((d) => d.id.name === "cats"))
    .forEach((path) =>
      path.node.declarations.forEach((d) => {
        d.id.name = "animals";
        d.init.elements.forEach((e) =>
          e.properties
            .filter((p) => p.value.type === "Literal")
            .forEach((p) => {
              p.value.value = utils.toSentenceCase(p.value.value);
              p.value.raw = `"${utils.toSentenceCase(p.value.value)}"`;
            })
        );
      })
    );

  return ast.toSource();
};

module.exports = basicTransformer;
