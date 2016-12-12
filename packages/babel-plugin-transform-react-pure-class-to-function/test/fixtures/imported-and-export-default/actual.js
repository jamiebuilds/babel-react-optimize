import React, { Component, PropTypes } from 'react';

export default class Foo extends Component {
  static propTypes = {
    foo: PropTypes.string.isRequired
  }

  static defaultProps = {
    foo: 'bar'
  }

  render() {
    this.props.foo;
    return <div />;
  }
}
