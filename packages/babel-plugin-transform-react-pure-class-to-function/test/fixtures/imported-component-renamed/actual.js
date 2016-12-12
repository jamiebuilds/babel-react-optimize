import React, { Component as Comp, PropTypes } from 'react';

module.exports = class Foo extends Comp {
  static propTypes = {
    foo: PropTypes.string.isRequired
  };

  render() {
    this.props.foo;
    return <div />;
  }
};
