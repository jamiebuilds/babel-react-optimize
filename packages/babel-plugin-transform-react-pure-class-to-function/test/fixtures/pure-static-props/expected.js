function Foo(props) {
  return <div className={props.className} />;
}

Foo.propTypes = {
  className: React.PropTypes.string
};
Foo.defaultProps = {
  className: 'foo'
};
