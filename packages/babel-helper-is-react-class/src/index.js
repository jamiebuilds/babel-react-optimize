module.exports = function(t) {
  return function isReactClass(path) {
    const superClass = path.node.superClass;

    const isDirectReactClass = (
      t.isMemberExpression(superClass) &&
      t.isIdentifier(superClass.object, { name: 'React' }) &&
      (
        t.isIdentifier(superClass.property, { name: 'Component' }) ||
        t.isIdentifier(superClass.property, { name: 'PureComponent' })
      )
    );

    if (isDirectReactClass) { return true; }

    const state = {
      localComponentNames: []
    };
    const importVisitor = {
      ImportDeclaration(nestedPath) {
        const node = nestedPath.node;

        if (t.isStringLiteral(node.source, { value: 'react' })) {
          this.localComponentNames = node.specifiers
            .filter(specifier => (
              t.isImportSpecifier(specifier) &&
              (
                specifier.imported.name === 'Component' ||
                specifier.imported.name === 'PureComponent'
              )
            ))
            .map(specifier => specifier.local.name);
        }
      }
    };

    // Check for imports as local variable names
    path.findParent(p => t.isProgram(p)).traverse(importVisitor, state);
    if (state.localComponentNames.length === 0) {
      return false;
    }
    return state.localComponentNames.indexOf(superClass.name) !== -1;
  };
}
