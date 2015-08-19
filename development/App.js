/* @flow */

import React from 'react';
import {Combo} from '../lib';

export default class App extends React.Component {

  state: Object;

  constructor(props: Object) {
    super(props);
    this.state = {item: 'c'};
  }

  itemChange(item: string) {
    this.setState({item});
  }

  render() {
    return (
      <Combo items={{
        a: {label: 'Winter', header: true},
        b: 'December',
        d: 'Febuary',
        c: 'January',
        e: '-',
        f: {label: 'Spring', header: true},
        g: 'March',
        h: 'April',
        i: 'May',
        j: '-',
        k: {label: 'Summer', header: true},
        l: 'June',
        m: 'July',
        n: 'August',
        o: '-',
        p: {label: 'Fall', header: true},
        q: 'September',
        r: 'October',
        s: 'November'
      }} value={this.state.item} onChange={this.itemChange.bind(this)} />
    );
  }

}
