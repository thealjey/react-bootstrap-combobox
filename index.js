/* @flow */

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import map from 'lodash/collection/map';
import debounce from 'lodash/function/debounce';

export class Combo extends React.Component {

  props: Object;

  handleResize: Function;

  static propTypes: Object;

  static defaultProps: Object;

  constructor(props: Object) {
    super(props);
    this.handleResize = debounce(this.onResize.bind(this), 150);
  }

  shouldComponentUpdate(props: Object): bool {
    return props.onChange !== this.props.onChange || props.items !== this.props.items ||
      props.value !== this.props.value;
  }

  onResize() {
    // TODO - when react bootstrap 1.0 comes out, make sure the following is still necessary
    var combo = this.refs.combo, menu = React.findDOMNode(combo.refs.menu);
    combo.setDropdownState(true);
    menu.style.maxHeight = `${window.innerHeight - menu.getBoundingClientRect().top - 5}px`;
    combo.setDropdownState(false);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <DropdownButton block ref="combo" className="al-combo" title={this.props.items[this.props.value]}
          onSelect={this.props.onChange.bind(this)}>
        {map(this.props.items, (item, i) => <MenuItem key={i} eventKey={i} active={i === this.props.value}>
          {item}
        </MenuItem>)}
      </DropdownButton>
    );
  }

}

Combo.propTypes = {
  onChange: React.PropTypes.func,
  items: React.PropTypes.object.isRequired,
  value: React.PropTypes.string.isRequired
};
Combo.defaultProps = {onChange: Function.prototype};
