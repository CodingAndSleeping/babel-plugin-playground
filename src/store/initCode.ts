export const sourceCode = `const fn = () => 'hello babel'`;

export const pluginCode = `import * as Babel from "@babel/core";

const transformFunction = ({ types: t }: typeof Babel): Babel.PluginObj => {
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        const node = path.node;
        if(t.isExpression(node.body)){
          const arrowFunction = t.functionExpression(
            null,
            node.params,
            t.blockStatement([t.returnStatement(node.body)]),
            node.async,
          );
          path.replaceWith(arrowFunction);
          }
      },
    },
  };
};
export default transformFunction;`;

export const resultCode = `const fn = function () {
  return 'hello babel';
};`;
