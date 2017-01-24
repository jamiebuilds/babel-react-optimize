module.exports = class Foo extends React.Component {
  static propTypes = {
    foo: React.PropTypes.string.isRequired
  };

  render() {
    const props = {
        foo: 'bar'
    };
    this.props.foo;
    return <div/>;
  }
};
