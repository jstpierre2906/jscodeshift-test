const fs = require("node:fs");
const { parser: postHTMLParser } = require("posthtml-parser");
const { render: postHTMLRender } = require("posthtml-render");

const markup = fs.readFileSync(`${__dirname}/../examples/html/example-markup.html`, {
  encoding: "utf-8",
});
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
    const transformAndReport = (item) => {
      nodeTargetTransformer(item);
      targetFound = true;
    };
    ast.forEach((firstLevelNode) => {
      if (targetFound) {
        return;
      }
      const recurse = (node) => {
        if (targetFound) {
          return;
        }
        if (node.tag && node.content) {
          if (nodeTargetPredicate(node)) {
            transformAndReport(node);
            return;
          }
          node.content.forEach((nodeContentItem) => {
            if (targetFound) {
              return;
            }
            if (nodeTargetPredicate(nodeContentItem)) {
              transformAndReport(nodeContentItem);
              return;
            }
            recurse(nodeContentItem);
          });
        }
      };
      recurse(firstLevelNode);
    });
    return ast;
  })({
    ast: postHTMLParser(markup),
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
fs.writeFileSync(`${__dirname}/../examples/html/example-markup.html`, modifiedHTML, {
  encoding: "utf-8",
});
