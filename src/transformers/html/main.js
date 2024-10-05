// @ts-nocheck
const fs = require("node:fs");
const { parser: postHTMLParser } = require("posthtml-parser");
const { render: postHTMLRender } = require("posthtml-render");

const htmlTransformer = require("./html-transformer.js");

const file = `${__dirname}/../../examples/html/example-markup.html`;
const fileContent = fs.readFileSync(file, { encoding: "utf-8" });
const transformedAST = htmlTransformer({
  ast: postHTMLParser(fileContent),
  transformers: [
    {
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
    },
    {
      nodeTargetPredicate: (node) => node.tag === "title",
      nodeTargetTransformer: (node) => {
        node.content[0] = "posthtml works like a charm!";
      },
    },
    {
      nodeTargetPredicate: (node) => node.tag === "head",
      nodeTargetTransformer: (node) => {
        const foundIndex = node.content.findIndex(
          (contentItem) => contentItem?.tag === "meta" && contentItem?.attrs?.name === "viewport"
        );
        if (foundIndex !== -1) {
          node.content = node.content.filter((_contentItem, index) => {
            // Also removing trailing carriage return, i.e. not leaving an empty line after node removal.
            if (/^(\n|\r\n)\s+$/.test(node.content[foundIndex + 1])) {
              return index !== foundIndex && index !== foundIndex + 1;
            }
            return index !== foundIndex;
          });
        }
      },
    },
  ],
});
const modifiedHTML = postHTMLRender(transformedAST, { closingSingleTag: "slash" });
console.log(modifiedHTML);
fs.writeFileSync(file, modifiedHTML, { encoding: "utf-8" });
