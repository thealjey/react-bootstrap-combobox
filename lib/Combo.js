/* @flow */

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import map from 'lodash/collection/map';
import isString from 'lodash/lang/isString';
import debounce from 'lodash/function/debounce';

/**
 * A combo-box component for React Bootstrap
 *
 * @class
 * @param {Object} props - A props config
 * @example
 * import {Combo} from 'react-bootstrap-combobox';
 *
 * React.render(<Combo items={{
 *   // keys must be unique
 *   a: {label: 'first item', header: true}, // any combination of props supported by MenuItem
 *   b: 'second item',                       // same as {label: 'second item'}
 *   c: '-'                                  // same as {divider: true}
 * }} value="b" />, document.getElementById('app'));
 */
export default class Combo extends React.Component {

  props: Object;

  viewportHeight: number;

  handleResize: Function;

  static propTypes: Object;

  static defaultProps: Object;

  constructor(props: Object) {
    super(props);

    /**
     * Height of the browser viewport
     *
     * @memberOf Combo
     * @instance
     * @private
     * @type {Number}
     */
    this.viewportHeight = 0;

    /**
     * Handles browser resize events, debounced by 150ms, executed on requestAnimationFrame
     *
     * @memberof Combo
     * @instance
     * @private
     * @method handleResize
     */
    this.handleResize = debounce(() => {
      window.requestAnimationFrame(() => {
        this.onResize();
      });
    }, 150);
  }

  /**
   * A performance hook
   *
   * @memberof Combo
   * @instance
   * @private
   * @method shouldComponentUpdate
   * @param  {Object}  props - A props config
   * @return {boolean} true if the component needs to be re-rendered
   */
  shouldComponentUpdate(props: Object): bool {
    return props.onChange !== this.props.onChange || props.items !== this.props.items ||
      props.value !== this.props.value;
  }

  /**
   * Invoked every time the viewport is resized
   *
   * @memberof Combo
   * @instance
   * @private
   * @method onResize
   */
  onResize() {
    var height = window.innerHeight, combo, menu, closed;

    if (this.viewportHeight === height) {
      return;
    }
    this.viewportHeight = height;

    combo = this.refs.combo;
    menu = React.findDOMNode(combo.refs.menu);
    closed = !combo.state.open;

    if (closed) {
      combo.setDropdownState(true);
    }
    menu.style.maxHeight = `${height - menu.getBoundingClientRect().top}px`;
    if (closed) {
      combo.setDropdownState(false);
    }
  }

  /**
   * Invoked when the component is mounted into the DOM tree
   *
   * @memberof Combo
   * @instance
   * @private
   * @method componentDidMount
   */
  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Invoked when the component is about to be unmounted from the DOM tree
   *
   * @memberof Combo
   * @instance
   * @private
   * @method componentWillUnmount
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   * Normalizes a dropdown item config object.
   *
   * @memberof Combo
   * @instance
   * @private
   * @method normalize
   * @param  {Object|string} value - a dropdown item config
   * @return {Object} a normalized config object
   */
  normalize(value: any): Object {
    return isString(value) ? ('-' === value ? {divider: true} : {label: value}) : value;
  }

  /**
   * A label of the currently active menu item
   *
   * @memberof Combo
   * @instance
   * @method getLabel
   * @return {string} a label of the currently active menu item
   */
  getLabel(): string {
    return this.normalize(this.props.items[this.props.value]).label;
  }

  /**
   * Invoked when the component is about to be unmounted from the DOM tree
   *
   * @memberof Combo
   * @instance
   * @private
   * @method render
   * @return {ReactElement} a virtual DOM tree representing the component
   */
  render(): any {
    var {items, value, onChange} = this.props;

    return (
      <DropdownButton block noCaret ref="combo" className="al-combo" title={
        <div className="wrap">{this.getLabel()}<span className="caret" /></div>
      } onSelect={onChange.bind(this)}>
        {map(items, (item, i) => {
          item = this.normalize(item);
          return (
            <MenuItem key={i} eventKey={i} active={i === value} {...item}>
              <div>{item.label}</div>
            </MenuItem>
          );
        })}
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
