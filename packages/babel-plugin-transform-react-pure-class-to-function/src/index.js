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
        if (!isReactClass(path.node)) {
          // yo, fuck this class then.
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
          // fuck this class too.
          return;
        }

        const id = t.identifier(path.node.id.name);

        let replacement = [];

        const renameProps = state.renderMethod.node.body.body.some(function(statement) {
            const isVariableDeclaration = statement.type === 'VariableDeclaration';
            return isVariableDeclaration && statement.declarations.filter(declr => declr.id.name === 'props').length;
        });

        state.thisProps.forEach(function(thisProp) {
          thisProp.replaceWith(t.identifier(renameProps ? '__props': 'props'));
        });

        replacement.push(
          t.functionDeclaration(
            id,
            [t.identifier(renameProps ? '__props': 'props')],
            state.renderMethod.node.body
          )
        );

        state.properties.forEach(prop => {
          replacement.push(t.expressionStatement(
            t.assignmentExpression('=',
              t.MemberExpression(id, prop.node.key),
              prop.node.value
            )
          ));
        });

        if (t.isExpression(path.node)) {
          replacement.push(t.returnStatement(id));

          replacement = t.callExpression(
            t.functionExpression(null, [],
              t.blockStatement(replacement)
            ),
            []
          );
        }

        path.replaceWithMultiple(
          replacement
        );
      }
    }
  };
};
