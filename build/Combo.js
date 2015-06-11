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

var Combo = (function (_React$Component) {
  function Combo(props) {
    _classCallCheck(this, Combo);

    _React$Component.call(this, props);
    this.handleResize = (0, _lodashFunctionDebounce2['default'])(this.onResize.bind(this), 150);
  }

  _inherits(Combo, _React$Component);

  Combo.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
    return props.onChange !== this.props.onChange || props.items !== this.props.items || props.value !== this.props.value;
  };

  Combo.prototype.onResize = function onResize() {
    var combo = this.refs.combo,
        menu = _react2['default'].findDOMNode(combo.refs.menu);
    combo.setDropdownState(true);
    menu.style.maxHeight = '' + (window.innerHeight - menu.getBoundingClientRect().top - 5) + 'px';
    combo.setDropdownState(false);
  };

  Combo.prototype.componentDidMount = function componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  };

  Combo.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  };

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