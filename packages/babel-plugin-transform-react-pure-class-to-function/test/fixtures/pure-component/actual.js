module.exports = class Foo extends React.PureComponent {
  static propTypes = {
    foo: React.PropTypes.string.isRequired
  };

  render() {
    this.props.foo;
    return <div />;
  }
};
