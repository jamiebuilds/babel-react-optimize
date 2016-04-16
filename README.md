# Babel React Optimize

A Babel preset and plugins for optimizing React code.

## Optimizations

### [`transform-react-constant-elements`](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements)

**Input:**

```js
class MyComponent extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <span>Hello World</span>
      </div>
    );
  }
}
```

**Output:**

```js
var _ref = <span>Hello World</span>;

class MyComponent extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        {_ref}
      </div>
    );
  }
}
```

### [`transform-react-inline-elements`](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements)

**Input:**

```js
class MyComponent extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <span>Hello World</span>
      </div>
    );
  }
}
```

**Output:**

```js
class MyComponent extends React.Component {
  render() {
    return (
      _jsx('div', { className: this.props.className }, void 0,
        _jsx('span', {}, void 0, 'Hello World')
      )
    );
  }
}
```

> **Note:** You should use this with `babel-runtime` and `babel-transform-runtime` to avoid duplicating the helper code in every file.

### [`transform-react-remove-prop-types`](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types)

**Input:**
```js
class MyComponent extends React.Component {
  static propTypes = {
    className: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className={this.props.className}>
        <span>Hello World</span>
      </div>
    );
  }
}
```

**Output:**

```js
class MyComponent extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <span>Hello World</span>
      </div>
    );
  }
}
```

### [`transform-react-pure-class-to-function`](https://github.com/thejameskyle/babel-react-optimize/tree/master/packages/babel-plugin-transform-react-pure-class-to-function)

**Input:**

```js
class MyComponent extends React.Component {
  static propTypes = {
    className: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className={this.props.className}>
        <span>Hello World</span>
      </div>
    );
  }
}
```

**Output:**

```js
function MyComponent(props) {
  return (
    <div className={props.className}>
      <span>Hello World</span>
    </div>
  );
}

MyComponent.propTypes = {
  className: React.PropTypes.string.isRequired
};
```

## Install

```sh
$ npm install --save-dev babel-preset-react-optimize
```

## Usage

`.babelrc`

```json
{
  "presets": ["es2015", "react"],
  "env": {
    "production": {
      "presets": ["es2015", "react", "react-optimize"]
    }
  }
}
```
