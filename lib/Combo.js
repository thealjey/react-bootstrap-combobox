/* @flow */

import React from 'react/lib/ReactWithAddons';
import {findDOMNode} from 'react-dom';
import {Button, Dropdown, MenuItem} from 'react-bootstrap';
import map from 'lodash/collection/map';
import isString from 'lodash/lang/isString';
import debounce from 'lodash/function/debounce';

const caret = <span className="caret" />,
    {func, object, string} = React.PropTypes;

let uid = 0;

/**
 * A combo-box component for React Bootstrap
 *
 * @class
 * @param {Object} props - A props config
 * @example
 * import {Combo} from 'react-bootstrap-combobox';
 * import {render} from 'react-dom';
 *
 * render(<Combo items={{
 *   // keys must be unique
 *   a: {label: 'first item', header: true}, // any combination of props supported by MenuItem
 *   b: 'second item',                       // same as {label: 'second item'}
 *   c: '-'                                  // same as {divider: true}
 * }} value="b" />, document.getElementById('app'));
 */
export default class Combo extends React.Component {

  props: Object;

  state: Object;

  id: string;

  viewportHeight: number;

  static propTypes: Object;

  static defaultProps: Object;

  constructor(props: Object) {
    super(props);

    /**
     * The html id
     *
     * @memberOf Combo
     * @instance
     * @private
     * @type {string}
     */
    this.id = `al-combo-${++uid}`;

    /**
     * Height of the browser viewport
     *
     * @memberOf Combo
     * @instance
     * @private
     * @type {number}
     */
    this.viewportHeight = 0;

    /**
     * Holds component state
     *
     * @memberof Combo
     * @instance
     * @private
     * @type {Object}
     */
    this.state = {maxHeight: null};

    this.onResize = debounce(this.onResize.bind(this), 150);
  }

  /**
   * A performance hook
   *
   * @memberof Combo
   * @instance
   * @private
   * @method shouldComponentUpdate
   * @param  {Object}  props - A props config
   * @param  {Object}  state - A new component state
   * @return {boolean} true if the component needs to be re-rendered
   */
  shouldComponentUpdate(props: Object, state: Object): boolean {
    return React.addons.shallowCompare(this, props, state);
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
    this.onResize();
    window.addEventListener('resize', this.onResize);
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
    window.removeEventListener('resize', this.onResize);
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
    const height = window.innerHeight;

    if (this.viewportHeight === height) {
      return;
    }
    this.viewportHeight = height;

    this.setState({maxHeight: height - findDOMNode(this).getBoundingClientRect().bottom - 5});
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
    const divider = '-' === value ? {divider: true} : {label: value};

    return isString(value) ? divider : value;
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
    const {items, value} = this.props;

    return this.normalize(items[value]).label;
  }

  /**
   * Renders a button
   *
   * @memberof Combo
   * @instance
   * @private
   * @method renderButton
   * @return {ReactElement} a virtual DOM tree
   */
  renderButton(): any {
    return (
      <Button block bsRole="toggle" className="dropdown-toggle">
        <div>{this.getLabel()}{caret}</div>
      </Button>
    );
  }

  /**
   * Renders a menu item
   *
   * @memberof Combo
   * @instance
   * @private
   * @method renderMenuItem
   * @param  {Object|string} item - a dropdown item config
   * @param  {string}        i    - a dropdown item key
   * @return {ReactElement} a virtual DOM tree
   */
  renderMenuItem(item: any, i: string): any {
    item = this.normalize(item);
    if (item.divider) {
      return <MenuItem key={i} divider />;
    }
    return (
      <MenuItem key={i} eventKey={i} active={i === this.props.value} {...item}>
        <div>{item.label}</div>
      </MenuItem>
    );
  }

  /**
   * Renders a menu
   *
   * @memberof Combo
   * @instance
   * @private
   * @method renderMenu
   * @return {ReactElement} a virtual DOM tree
   */
  renderMenu(): any {
    return (
      <Dropdown.Menu style={this.state}>
        {map(this.props.items, this.renderMenuItem, this)}
      </Dropdown.Menu>
    );
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
    return (
      <Dropdown className="al-combo" id={this.id} onSelect={this.props.onChange}>
        {this.renderButton()}
        {this.renderMenu()}
      </Dropdown>
    );
  }

}

Combo.propTypes = {onChange: func, items: object.isRequired, value: string.isRequired};
Combo.defaultProps = {onChange: Function.prototype};
