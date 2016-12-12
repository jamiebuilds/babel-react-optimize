class Foo extends React.Component {
  static propTypes = {
    className: React.PropTypes.string
  };

  static defaultProps = {
    className: 'foo'
  };

  render() {
    return <div className={this.props.className} />;
  }
}
