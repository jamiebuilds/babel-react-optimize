# Babel React Optimize

A Babel preset and plugins for optimizing React code.

### Install

```sh
$ npm install --save-dev babel-preset-react-optimize
```

### Usage

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
