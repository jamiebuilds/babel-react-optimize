import React, { PropTypes } from 'react';

class Component {
  // A big faker!
}

module.exports = class Foo extends Component {
  static propTypes = {
    foo: PropTypes.string.isRequired
  };

  render() {
    this.props.foo;
    return <div />;
  }
};
