

'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var _lodashFunctionDebounce = require('lodash/function/debounce');

var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

/**
 * A combo-box component for React Bootstrap
 *
 * @class
 * @param {Object} props - A props config
 */

var Combo = (function (_React$Component) {

  /**
   * Constructor
   *
   * @param {Object} props - A props config
   */

  function Combo(props) {
    _classCallCheck(this, Combo);

    _React$Component.call(this, props);

    /**
     * Invoked when the component is mounted into the DOM tree, debounced by 150ms
     *
     * @memberof Combo
     * @instance
     * @method handleResize
     */
    this.handleResize = (0, _lodashFunctionDebounce2['default'])(this.onResize.bind(this), 150);
  }

  _inherits(Combo, _React$Component);

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

  Combo.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
    return props.onChange !== this.props.onChange || props.items !== this.props.items || props.value !== this.props.value;
  };

  /**
   * Invoked every time the viewport is resized
   *
   * @memberof Combo
   * @instance
   * @private
   * @method onResize
   */

  Combo.prototype.onResize = function onResize() {

    // TODO - when react bootstrap 1.0 comes out, make sure the following is still necessary
    var combo = this.refs.combo,
        menu = _react2['default'].findDOMNode(combo.refs.menu);

    combo.setDropdownState(true);
    menu.style.maxHeight = '' + (window.innerHeight - menu.getBoundingClientRect().top - 5) + 'px';
    combo.setDropdownState(false);
  };

  /**
   * Invoked when the component is mounted into the DOM tree
   *
   * @memberof Combo
   * @instance
   * @protected
   * @method componentDidMount
   */

  Combo.prototype.componentDidMount = function componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  };

  /**
   * Invoked when the component is about to be unmounted from the DOM tree
   *
   * @memberof Combo
   * @instance
   * @protected
   * @method componentWillUnmount
   */

  Combo.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  };

  /**
   * Invoked when the component is about to be unmounted from the DOM tree
   *
   * @memberof Combo
   * @instance
   * @protected
   * @method render
   * @return {ReactElement} a virtual DOM tree representing the component
   */

  Combo.prototype.render = function render() {
    var _this = this;

    return _react2['default'].createElement(
      _reactBootstrap.DropdownButton,
      { block: true, ref: 'combo', className: 'al-combo', title: this.props.items[this.props.value],
        onSelect: this.props.onChange.bind(this) },
      (0, _lodashCollectionMap2['default'])(this.props.items, function (item, i) {
        return _react2['default'].createElement(
          _reactBootstrap.MenuItem,
          { key: i, eventKey: i, active: i === _this.props.value },
          item
        );
      })
    );
  };

  return Combo;
})(_react2['default'].Component);

exports.Combo = Combo;

Combo.propTypes = {
  onChange: _react2['default'].PropTypes.func,
  items: _react2['default'].PropTypes.object.isRequired,
  value: _react2['default'].PropTypes.string.isRequired
};
Combo.defaultProps = { onChange: Function.prototype };