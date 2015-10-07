'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var _lodashLangIsString = require('lodash/lang/isString');

var _lodashLangIsString2 = _interopRequireDefault(_lodashLangIsString);

var _lodashFunctionDebounce = require('lodash/function/debounce');

var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

var uid = 0;

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

var Combo = (function (_React$Component) {
  _inherits(Combo, _React$Component);

  function Combo(props) {
    _classCallCheck(this, Combo);

    _get(Object.getPrototypeOf(Combo.prototype), 'constructor', this).call(this, props);

    /**
     * The html id
     *
     * @memberOf Combo
     * @instance
     * @private
     * @type {string}
     */
    this.id = 'al-combo-' + ++uid;

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
     * Handles browser resize events, debounced by 150ms
     *
     * @memberof Combo
     * @instance
     * @private
     * @method handleResize
     */
    this.handleResize = (0, _lodashFunctionDebounce2['default'])(this.onResize.bind(this), 150);

    /**
     * Holds component state
     *
     * @memberof Combo
     * @instance
     * @private
     * @type {Object}
     */
    this.state = { maxHeight: null };
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

  _createClass(Combo, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(props, state) {
      return props.onChange !== this.props.onChange || props.items !== this.props.items || props.value !== this.props.value || state.maxHeight !== this.state.maxHeight;
    }

    /**
     * Invoked when the component is mounted into the DOM tree
     *
     * @memberof Combo
     * @instance
     * @private
     * @method componentDidMount
     */
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
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
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    /**
     * Invoked every time the viewport is resized
     *
     * @memberof Combo
     * @instance
     * @private
     * @method onResize
     */
  }, {
    key: 'onResize',
    value: function onResize() {
      var height = window.innerHeight;

      if (this.viewportHeight === height) {
        return;
      }
      this.viewportHeight = height;

      this.setState({ maxHeight: height - _react2['default'].findDOMNode(this).getBoundingClientRect().bottom - 5 });
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
  }, {
    key: 'normalize',
    value: function normalize(value) {
      var divider = '-' === value ? { divider: true } : { label: value };

      return (0, _lodashLangIsString2['default'])(value) ? divider : value;
    }

    /**
     * A label of the currently active menu item
     *
     * @memberof Combo
     * @instance
     * @method getLabel
     * @return {string} a label of the currently active menu item
     */
  }, {
    key: 'getLabel',
    value: function getLabel() {
      return this.normalize(this.props.items[this.props.value]).label;
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
  }, {
    key: 'renderButton',
    value: function renderButton() {
      return _react2['default'].createElement(
        _reactBootstrap.Button,
        { block: true, bsRole: 'toggle', className: 'dropdown-toggle' },
        _react2['default'].createElement(
          'div',
          null,
          this.getLabel(),
          _react2['default'].createElement('span', { className: 'caret' })
        )
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
  }, {
    key: 'renderMenuItem',
    value: function renderMenuItem(item, i) {
      item = this.normalize(item);
      if (item.divider) {
        return _react2['default'].createElement(_reactBootstrap.MenuItem, { key: i, divider: true });
      }
      return _react2['default'].createElement(
        _reactBootstrap.MenuItem,
        _extends({ key: i, eventKey: i, active: i === this.props.value }, item),
        _react2['default'].createElement(
          'div',
          null,
          item.label
        )
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
  }, {
    key: 'renderMenu',
    value: function renderMenu() {
      return _react2['default'].createElement(
        _reactBootstrap.Dropdown.Menu,
        { style: this.state },
        (0, _lodashCollectionMap2['default'])(this.props.items, this.renderMenuItem, this)
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
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _reactBootstrap.Dropdown,
        { className: 'al-combo', id: this.id, onSelect: this.props.onChange },
        this.renderButton(),
        this.renderMenu()
      );
    }
  }]);

  return Combo;
})(_react2['default'].Component);

exports['default'] = Combo;

Combo.propTypes = {
  onChange: _react2['default'].PropTypes.func,
  items: _react2['default'].PropTypes.object.isRequired,
  value: _react2['default'].PropTypes.string.isRequired
};
Combo.defaultProps = { onChange: Function.prototype };
module.exports = exports['default'];