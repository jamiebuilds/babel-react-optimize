import React, { Component, PropTypes } from 'react';

export default function Foo(props) {
  props.foo;
  return <div />;
}
Foo.propTypes = {
  foo: PropTypes.string.isRequired
};
Foo.defaultProps = {
  foo: 'bar'
};
