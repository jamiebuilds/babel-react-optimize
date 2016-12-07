function isJSXElementOrReactCreateElement(node) {
  if (node.type === 'JSXElement') {
    return true;
  }

  if (node.callee && node.callee.object.name === 'React' && node.callee.property.name === 'createElement') {
    return true;
  }

  return false;
}

function isReturningJSXElement(path) {
  /**
   * Early exit for ArrowFunctionExpressions, there is no ReturnStatement node.
   */
  if (path.node.init && path.node.init.body && isJSXElementOrReactCreateElement(path.node.init.body)) {
    return true;
  }

  let visited = false;

  path.traverse({
    ReturnStatement(path2) {
      // We have already found what we are looking for.
      if (visited) {
        return;
      }

      const argument = path2.get('argument');

      // Nothing is returned
      if (!argument.node) {
        return;
      }

      if (isJSXElementOrReactCreateElement(argument.node)) {
        visited = true;
        return;
      }

      if (argument.node.type === 'CallExpression') {
        const name = argument.get('callee').node.name;
        const binding = path.scope.getBinding(name);

        if (!binding) {
          return;
        }

        if (isReturningJSXElement(binding.path)) {
          visited = true;
        }
      }
    },
  });

  return visited;
}

const validPossibleStatelessComponentTypes = [
  'VariableDeclarator',
  'FunctionDeclaration',
];

/**
 * Returns `true` if the path represents a function which returns a JSXElement
 */
export default function isStatelessComponent(path) {
  const node = path.node;

  if (validPossibleStatelessComponentTypes.indexOf(node.type) === -1) {
    return false;
  }

  if (isReturningJSXElement(path)) {
    return true;
  }

  return false;
}
