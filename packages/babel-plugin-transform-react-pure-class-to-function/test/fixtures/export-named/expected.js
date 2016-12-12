export function Foo(props) {
  props.foo;
  return <div />;
}
Foo.propTypes = {
  foo: React.PropTypes.string.isRequired
};
