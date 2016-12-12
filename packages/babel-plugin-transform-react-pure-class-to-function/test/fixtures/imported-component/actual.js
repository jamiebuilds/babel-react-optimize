import React, { Component, PropTypes } from 'react';

module.exports = class Foo extends Component {
  static propTypes = {
    foo: PropTypes.string.isRequired
  };

  render() {
    this.props.foo;
    return <div />;
  }
};
