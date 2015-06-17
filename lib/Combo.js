/* @flow */

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import map from 'lodash/collection/map';
import debounce from 'lodash/function/debounce';

/**
 * A combo-box component for React Bootstrap
 *
 * @class
 * @param {Object} props - A props config
 */
export class Combo extends React.Component {

  props: Object;

  handleResize: Function;

  static propTypes: Object;

  static defaultProps: Object;

  /**
   * Constructor
   *
   * @param {Object} props - A props config
   */
  constructor(props: Object) {
    super(props);

    /**
     * Invoked when the component is mounted into the DOM tree, debounced by 150ms
     *
     * @memberof Combo
     * @instance
     * @method handleResize
     */
    this.handleResize = debounce(this.onResize.bind(this), 150);
  }

  /**
   * A performance hook
   *
   * @memberof Combo
   * @instance
   * @protected
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

    // TODO - when react bootstrap 1.0 comes out, make sure the following is still necessary
    var combo = this.refs.combo, menu = React.findDOMNode(combo.refs.menu);

    combo.setDropdownState(true);
    menu.style.maxHeight = `${window.innerHeight - menu.getBoundingClientRect().top - 5}px`;
    combo.setDropdownState(false);
  }

  /**
   * Invoked when the component is mounted into the DOM tree
   *
   * @memberof Combo
   * @instance
   * @protected
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
   * @protected
   * @method componentWillUnmount
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   * Invoked when the component is about to be unmounted from the DOM tree
   *
   * @memberof Combo
   * @instance
   * @protected
   * @method render
   * @return {ReactElement} a virtual DOM tree representing the component
   */
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
