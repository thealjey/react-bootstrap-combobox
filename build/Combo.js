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
    var _this = this;

    _classCallCheck(this, Combo);

    _get(Object.getPrototypeOf(Combo.prototype), 'constructor', this).call(this, props);

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
    this.handleResize = (0, _lodashFunctionDebounce2['default'])(function () {
      window.requestAnimationFrame(function () {
        _this.onResize();
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

  _createClass(Combo, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(props) {
      return props.onChange !== this.props.onChange || props.items !== this.props.items || props.value !== this.props.value;
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
      var height = window.innerHeight,
          combo,
          menu,
          closed;

      if (this.viewportHeight === height) {
        return;
      }
      this.viewportHeight = height;

      combo = this.refs.combo;
      menu = _react2['default'].findDOMNode(combo.refs.menu);
      closed = !combo.state.open;

      if (closed) {
        combo.setDropdownState(true);
      }
      menu.style.maxHeight = height - menu.getBoundingClientRect().top + 'px';
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
      return (0, _lodashLangIsString2['default'])(value) ? '-' === value ? { divider: true } : { label: value } : value;
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
      var _this2 = this;

      var _props = this.props;
      var items = _props.items;
      var value = _props.value;
      var onChange = _props.onChange;

      return _react2['default'].createElement(
        _reactBootstrap.DropdownButton,
        { block: true, noCaret: true, ref: 'combo', className: 'al-combo', title: _react2['default'].createElement(
            'div',
            { className: 'wrap' },
            this.getLabel(),
            _react2['default'].createElement('span', { className: 'caret' })
          ), onSelect: onChange.bind(this) },
        (0, _lodashCollectionMap2['default'])(items, function (item, i) {
          item = _this2.normalize(item);
          return _react2['default'].createElement(
            _reactBootstrap.MenuItem,
            _extends({ key: i, eventKey: i, active: i === value }, item),
            _react2['default'].createElement(
              'div',
              null,
              item.label
            )
          );
        })
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