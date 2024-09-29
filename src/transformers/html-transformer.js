const fs = require("node:fs");
const { parser: postHTMLParser } = require("posthtml-parser");
const { render: postHTMLRender } = require("posthtml-render");

const file = `${__dirname}/../examples/html/example-markup.html`;
const fileContent = fs.readFileSync(file, { encoding: "utf-8" });
// Original HTML:
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Document</title>
//   </head>
//   <body>
//     <div id="container">
//       <div class="red">Just a div</div>
//     </div>
//   </body>
// </html>
const modifiedHTML = postHTMLRender(
  (({ ast, nodeTargetPredicate, nodeTargetTransformer }) => {
    let targetFound = false;
    const applyTransform = (item) => {
      targetFound = true;
      try {
        nodeTargetTransformer(item);
      } catch (error) {
        console.error(error);
      }
    };
    ast.forEach((firstLevelNode) => {
      if (targetFound) return;
      const recurseThroughHTMLTree = (node) => {
        if (targetFound) return;
        if (node.tag && node.content) {
          if (nodeTargetPredicate(node)) {
            applyTransform(node);
            return;
          }
          node.content.forEach((nodeContentItem) => {
            if (targetFound) return;
            if (nodeTargetPredicate(nodeContentItem)) {
              applyTransform(nodeContentItem);
              return;
            }
            recurseThroughHTMLTree(nodeContentItem);
          });
        }
      };
      recurseThroughHTMLTree(firstLevelNode);
    });
    return ast;
  })({
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
  }),
  { closingSingleTag: "slash" }
);
console.log(modifiedHTML);
// Modified HTML:
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Document</title>
//   </head>
//   <body>
//     <div id="container">
//       <section class="blue"><span class="some-stylin">works!</span></section>
//     </div>
//   </body>
// </html>
fs.writeFileSync(file, modifiedHTML, { encoding: "utf-8" });
