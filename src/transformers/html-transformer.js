const fs = require("node:fs");
const { parser: postHTMLParser } = require("posthtml-parser");
const { render: postHTMLRender } = require("posthtml-render");

// Original HTML:
// <div class="red">Just a div</div>
const markup = fs.readFileSync(`${__dirname}/../examples/html/example-markup.html`, "utf-8");
const modifiedHTML = postHTMLRender(
  ((ast) => {
    console.log(ast);
    // Parsed HMTL as AST:
    //   [
    //     { tag: 'div', attrs: { class: 'red' }, content: [ 'Just a div' ] },
    //     '\n'
    //   ]
    ast
      .filter((node) => node.tag === "div")
      .forEach((node) => {
        node.tag = "section";
        node.attrs.class = "blue";
        node.content[0] = node.content[0].replace("div", "section");
      });
    return ast;
  })(postHTMLParser(markup))
);

console.log(modifiedHTML);
// Modified HTML:
// <section class="blue">Just a section</section>
