# react-bootstrap-combobox
*A combo-box component for React Bootstrap.*

[Project Home](https://github.com/thealjey/react-bootstrap-combobox)
|
[API Docs](https://thealjey.github.io/react-bootstrap-combobox)

[![Build Status](https://travis-ci.org/thealjey/react-bootstrap-combobox.svg?branch=master)](https://travis-ci.org/thealjey/react-bootstrap-combobox)
[![Coverage Status](https://coveralls.io/repos/thealjey/react-bootstrap-combobox/badge.svg?branch=master&service=github)](https://coveralls.io/github/thealjey/react-bootstrap-combobox?branch=master)
[![Code Climate](https://codeclimate.com/github/thealjey/react-bootstrap-combobox/badges/gpa.svg)](https://codeclimate.com/github/thealjey/react-bootstrap-combobox)
[![Dependency Status](https://david-dm.org/thealjey/react-bootstrap-combobox.svg)](https://david-dm.org/thealjey/react-bootstrap-combobox)
[![devDependency Status](https://david-dm.org/thealjey/react-bootstrap-combobox/dev-status.svg)](https://david-dm.org/thealjey/react-bootstrap-combobox#info=devDependencies)
[![peerDependency Status](https://david-dm.org/thealjey/react-bootstrap-combobox/peer-status.svg)](https://david-dm.org/thealjey/react-bootstrap-combobox#info=peerDependencies)
[![npm version](https://badge.fury.io/js/react-bootstrap-combobox.svg)](http://badge.fury.io/js/react-bootstrap-combobox)
[![Slack channel](https://img.shields.io/badge/slack-combobox-blue.svg)](https://webcompiler.slack.com/messages/combobox)

This is a very simple stateless wrapper around DropdownButton and MenuItem.

### Features

1. Minimizes the number of characters one would need to type when building a component in this fashion
2. Provides a good looking dropdown component, built on Twitter Bootstrap, customizable with SASS, that works and looks
   the same in all major browsers
3. The dropdown menu has a maximum height automatically calculated to prevent it from overflowing the viewport
4. Provides a number of performance optimizations, both in JavaScript and CSS

### Hint

Do not forget to set the `NODE_ENV` environment variable to **"production"** in production to get some instant
performance increase from React for free!

### Installation

```
npm i react-bootstrap-combobox --save
```

### Usage

You need to include the **"_index.scss"** file from this package.
If you are using [webcompiler](https://github.com/thealjey/webcompiler) then you can simply do:

```SCSS
// import Bootstrap
@import "bootstrap";
// import Bootstrap theme
@import "bootstrap/theme";
// import the component
@import "react-bootstrap-combobox";
```

and then:

```JavaScript
import {Combo} from 'react-bootstrap-combobox';

function someFunc(key: string) {
  ...
}

<Combo items={{
  // keys must be unique
  sweden: {label: 'Sweden', header: true}, // any combination of props supported by MenuItem
  volvo: 'Volvo',                          // same as {label: 'Volvo'}
  saab: 'Saab',
  separator: '-',                          // same as {divider: true}
  germany: {label: 'Germany', header: true},
  mercedes: 'Mercedes',
  audi: 'Audi'
}} value="volvo" onChange={someFunc} />
```

### Caveats

1. Both `items` and `value` are required props
2. The component is stateless, which means that its `value` cannot be changed without re-rendering it
3. For performance reasons `items` are considered immutable
