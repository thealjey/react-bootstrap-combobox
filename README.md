# react-bootstrap-combobox
*A combo-box component for React Bootstrap.*

This is a very simple stateless wrapper around DropdownButton and MenuItem.
It currently does only 2 things:

1. Minimizes the number of characters one would need to type when building a component in this fashion.
2. The dropdown menu has a maximum height automatically calculated to prevent it from overflowing the viewport.

### Installation

`npm i react-bootstrap-combobox --save`

### Usage

```
import {Combo} from 'react-bootstrap-combobox';

function someFunc(key: string) {
  ...
}

<Combo items={{
  volvo: 'Volvo',
  saab: 'Saab',
  mercedes: 'Mercedes',
  audi: 'Audi'
}} value="volvo" onChange={someFunc} />
```

### Caveats

1. Both `items` and `value` are required props.
2. The component is stateless, which means that its `value` cannot be changed without re-rendering it.
3. For performance reasons `items` are considered immutable.
4. The component is written using ES6 + Flow static types + JSX (comes precompiled with
[webcompiler](https://github.com/thealjey/webcompiler)) and SASS.
