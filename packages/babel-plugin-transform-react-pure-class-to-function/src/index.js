module.exports = function({ types: t }) {
  const isReactClass = require('babel-helper-is-react-class')(t);

  const bodyVisitor = {
    ClassMethod(path) {
      if (path.node.key.name === 'render') {
        this.renderMethod = path;
      } else {
        this.isPure = false;
        path.stop();
      }
    },

    ClassProperty(path) {
      const name = path.node.key.name;

      if (path.node.static && (
        name === 'propTypes' ||
        name === 'defaultProps'
      )) {
        this.properties.push(path);
      } else {
        this.isPure = false;
      }
    },

    MemberExpression(path) {
      const { node } = path;

      // non-this member expressions dont matter
      if (!t.isThisExpression(node.object)) {
        return;
      }

      // Don't allow this.<anything other than props>
      if (!t.isIdentifier(node.property, { name: 'props' })) {
        this.isPure = false;
        path.stop();
        return;
      }

      // this.props.foo => props.foo
      this.thisProps.push(path);
    },

    JSXIdentifier(path) {
      if (path.node.name === 'ref') {
        this.isPure = false;
        path.stop();
      }
    }
  };

  return {
    visitor: {
      Class(path) {
        if (!isReactClass(path)) {
          // Not a React class
          return;
        }

        const state = {
          renderMethod: null,
          properties: [],
          thisProps: [],
          isPure: true
        };

        // get the render method and make sure it doesn't have any other methods
        path.traverse(bodyVisitor, state);

        if (!state.isPure || !state.renderMethod) {
          // Not a class that can be converted to a functional component
          return;
        }

        const id = t.identifier(path.node.id.name);

        state.thisProps.forEach(function(thisProp) {
          thisProp.replaceWith(t.identifier('props'));
        });

        const functionalComponent = t.functionDeclaration(
          id,
          [t.identifier('props')],
          state.renderMethod.node.body
        );

        const staticProps = state.properties.map(prop => t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(id, prop.node.key),
            prop.node.value
          )
        ));

        if (t.isExpression(path.node)) {
          // Wrap with IIFE for expressions
          const iife = [
            functionalComponent,
            ...staticProps,
            t.returnStatement(id)
          ];
          path.replaceWith(
            t.callExpression(
              t.functionExpression(
                null,
                [],
                t.blockStatement(iife)
              ),
              []
            )
          );
        } else if (t.isExportDeclaration(path.parent)) {
          // Fix "We don't know what to do with this node type" errors
          // for ES6 default/named exports
          path.replaceWith(functionalComponent);
          path.parentPath.insertAfter(staticProps);
        } else {
          // Everything else
          const replacement = [functionalComponent, ...staticProps];
          path.replaceWithMultiple(replacement);
        }
      }
    }
  };
}
