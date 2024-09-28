const fs = require("node:fs");
const { parser: postHTMLParser } = require("posthtml-parser");
const { render: postHTMLRender } = require("posthtml-render");

// Original HTML:
// <div class="red">Just a div</div>
const markup = fs.readFileSync(`${__dirname}/../examples/html/example-markup.html`, "utf-8");
const modifiedHTML = postHTMLRender(
  (({ ast, newTextContent, nodeTargetPredicate }) => {
    console.log(ast);
    // Parsed HMTL as AST:
    //   [
    //     { tag: 'div', attrs: { class: 'red' }, content: [ 'Just a div' ] },
    //     '\n'
    //   ]
    ast
      .filter((node) => nodeTargetPredicate(node))
      .forEach((node) => {
        node.tag = "section";
        node.attrs.class = "blue";
        node.content[0] = {
          tag: "span",
          attrs: { class: "some-stylin" },
          content: newTextContent,
        };
      });
    return ast;
  })({
    ast: postHTMLParser(markup),
    newTextContent: "Works!",
    nodeTargetPredicate: (node) => node.tag === "div" && node.attrs.class === "red",
  })
);

console.log(modifiedHTML);
// Modified HTML:
// <section class="blue"><span class="some-stylin">Works!</span></section>
