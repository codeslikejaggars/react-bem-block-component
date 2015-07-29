'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var BEMBlock = (function (_React$Component) {
  function BEMBlock(props) {
    _classCallCheck(this, BEMBlock);

    _get(Object.getPrototypeOf(BEMBlock.prototype), 'constructor', this).call(this, props);
  }

  _inherits(BEMBlock, _React$Component);

  _createClass(BEMBlock, [{
    key: '_renderChildren',
    value: function _renderChildren() {
      var _this = this;

      return _react2['default'].Children.map(this.props.children, function (child) {
        return bemize(child, _this.props.blockName);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var blockName = _props.blockName;
      var bemMod = _props.bemMod;
      var elementType = _props.elementType;

      var blockClasses = [blockName];

      if (bemMod) {
        Array.prototype.push.apply(blockClasses, handleMods(blockName, bemMod));
      }

      return _react2['default'].createElement(elementType, {
        className: blockClasses.join(' ')
      }, this._renderChildren());
    }
  }]);

  return BEMBlock;
})(_react2['default'].Component);

exports['default'] = BEMBlock;

BEMBlock.propTypes = {
  elementType: _react2['default'].PropTypes.oneOf(_lodash2['default'].keys(_react2['default'].DOM)),
  blockName: _react2['default'].PropTypes.string.isRequired
};

BEMBlock.defaultProps = {
  elementType: _react2['default'].DOM.div
};

var ELEM_SEPARATOR = '__';
var MOD_SEPARATOR = '--';

var makeMod = function makeMod(base, mod) {
  return base + MOD_SEPARATOR + mod;
};
var makeElem = function makeElem(base, elem) {
  return base + ELEM_SEPARATOR + elem;
};

function bemize(reactElement, base) {
  // skip if not a ReactElement or no bemElem prop
  if (!reactElement.props) {
    return reactElement;
  }

  var _reactElement$props = reactElement.props;
  var bemElem = _reactElement$props.bemElem;
  var bemMod = _reactElement$props.bemMod;
  var children = _reactElement$props.children;

  var baseClass = undefined;
  if (bemElem) {
    baseClass = makeElem(base, bemElem);
  } else {
    baseClass = base;
  }

  // retain : reactElem.props.className;
  var classes = [];

  if (reactElement.props.className) {
    classes.push(reactElement.props.className);
  }

  if (bemElem) {
    classes.push(makeElem(base, bemElem));

    // handle mods
    if (bemMod) {
      Array.prototype.push.apply(classes, handleMods(baseClass, bemMod));
    }
  }

  // TODO check this doesn't cause stack overflows
  // recurse for all children
  var updatedChildren = _react2['default'].Children.map(children, function (child) {
    return bemize(child, baseClass);
  });

  return _react2['default'].cloneElement(reactElement, {
    className: [].concat(_toConsumableArray(new Set(classes))).join(' ')
  }, updatedChildren);
}

function handleMods(baseClass, bemMod) {
  // handle mods
  if (_lodash2['default'].isString(bemMod)) {
    return [makeMod(baseClass, bemMod)];
  }

  if (_lodash2['default'].isArray(bemMod)) {
    return bemMod.map(function (modClass) {
      return makeMod(baseClass, modClass);
    });
  }

  if (_lodash2['default'].isObject(bemMod)) {
    return (0, _lodash2['default'])(bemMod).filter(function (predicate) {
      return predicate;
    }).map(function (p, modClass) {
      return makeMod(baseClass, modClass);
    }).value();
  }

  throw new Error('unable to handle type of prop `bemMod`: ' + bemMod);
}
module.exports = exports['default'];