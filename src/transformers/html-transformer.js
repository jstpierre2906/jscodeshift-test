const fs = require("node:fs");
const { parser } = require("posthtml-parser");
const { render } = require("posthtml-render");

const htmlFile = fs.readFileSync(`${__dirname}/../examples/html/example-markup.html`, "utf-8");
// Original HTML:
// <div class="red">Just a div</div>
const html = render(
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
      });
    return ast;
  })(parser(htmlFile))
);

console.log(html);
// Modified HTML:
// <section class="red">Just a div</section>
