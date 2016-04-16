export default function(t) {
  return function isReactClass(node) {
    const superClass = node.superClass;
    return (
      t.isMemberExpression(superClass) &&
      t.isIdentifier(superClass.object, { name: 'React' }) &&
      t.isIdentifier(superClass.property, { name: 'Component' })
    );
  };
}
