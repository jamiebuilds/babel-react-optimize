class Foo extends React.Component {
  componentDidMount() {
    console.log('I mounted');
  }

  render() {
    this.props.foo;
    return <div />;
  }
}
