# react-bootstrap-combobox
*A combo-box component for React Bootstrap.*

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

### API Documentation

To get better acquainted with the available tools feel free to skim through the auto-generated
[API Docs](https://rawgit.com/thealjey/react-bootstrap-combobox/master/docs/index.html).

### Usage

You need to include the **"_index.scss"** file from this package.
If you are using [webcompiler](https://github.com/thealjey/webcompiler) then you can simply do:

```SCSS
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
