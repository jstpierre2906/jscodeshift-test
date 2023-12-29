const basicTransformer = (fileInfo, api, options) => {
  const j = api.jscodeshift;
  const rootSource = j(fileInfo.source);

//   console.log(j);
//   console.log(j.findVariableDeclarators("foo"));

  return rootSource.toSource();

  // return api.jscodeshift(fileInfo.source)
  //     .findVariableDeclarators("foo")
  //     .renameTo("bar")
  //     .toSource();
};

module.exports = basicTransformer;
