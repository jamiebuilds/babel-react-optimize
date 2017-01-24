module.exports = function () {
  function Foo(__props) {
    const props = {
      foo: 'bar'
    };
    __props.foo;
    return <div />;
  }

  Foo.propTypes = {
    foo: React.PropTypes.string.isRequired
  };
  return Foo;
}();
