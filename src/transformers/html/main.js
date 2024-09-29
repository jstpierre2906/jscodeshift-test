const fs = require("node:fs");
const { parser: postHTMLParser } = require("posthtml-parser");
const { render: postHTMLRender } = require("posthtml-render");

const htmlTransformer = require("./html-transformer.js")

const file = `${__dirname}/../../examples/html/example-markup.html`;
const fileContent = fs.readFileSync(file, { encoding: "utf-8" });
const transformedAST = htmlTransformer({
  ast: postHTMLParser(fileContent),
  nodeTargetPredicate: (node) => node.tag === "div" && node.attrs.class === "red",
  nodeTargetTransformer: (node) => {
    node.tag = "section";
    node.attrs.class = "blue";
    node.content[0] = {
      tag: "span",
      attrs: { class: "some-stylin" },
      content: "works!",
    };
  },
});
const modifiedHTML = postHTMLRender(transformedAST, { closingSingleTag: "slash" });
console.log(modifiedHTML);
fs.writeFileSync(file, modifiedHTML, { encoding: "utf-8" });
