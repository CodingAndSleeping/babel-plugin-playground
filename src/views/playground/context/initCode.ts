export const sourceCode = `const fn = () => 'hello babel'`;

export const pluginCode = `const transformFunction = ({ types: t }) => {
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        const node = path.node;
        const arrowFunction = t.functionExpression(
          null,
          node.params,
          t.blockStatement([t.returnStatement(node.body)]),
          node.async,
        );
        path.replaceWith(arrowFunction);
      },
    },
  };
};
export default transformFunction;`;

export const resultCode = `const fn = function () {
  return 'hello babel';
};`;
