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

var BEMBlock = (function (_React$Component) {
  function BEMBlock(props) {
    _classCallCheck(this, BEMBlock);

    _get(Object.getPrototypeOf(BEMBlock.prototype), 'constructor', this).call(this, props);
  }

  _inherits(BEMBlock, _React$Component);

  _createClass(BEMBlock, [{
    key: '_className',
    value: function _className() {
      var _props = this.props;
      var blockName = _props.blockName;
      var bemMod = _props.bemMod;

      var blockClasses = [blockName];

      if (bemMod) {
        blockClasses.push.apply(blockClasses, _toConsumableArray(handleMods(blockName, bemMod)));
      }

      return blockClasses.join(' ');
    }
  }, {
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
      return _react2['default'].createElement(this.props.elementType, { className: this._className() }, this._renderChildren());
    }
  }]);

  return BEMBlock;
})(_react2['default'].Component);

exports['default'] = BEMBlock;

BEMBlock.propTypes = {
  elementType: _react2['default'].PropTypes.oneOf(Object.keys(_react2['default'].DOM)),
  blockName: _react2['default'].PropTypes.string.isRequired
};

BEMBlock.defaultProps = {
  elementType: 'div'
};

var modifier = function modifier(base, mod) {
  return base + '__' + mod;
};
var element = function element(base, elem) {
  return base + '--' + elem;
};

function bemize(reactElement, base) {
  // skip if not a ReactElement or no bemElem prop
  if (!reactElement.props) {
    return reactElement;
  }

  var _reactElement$props = reactElement.props;
  var className = _reactElement$props.className;
  var bemElem = _reactElement$props.bemElem;
  var bemMod = _reactElement$props.bemMod;
  var children = _reactElement$props.children;

  var baseClass = bemElem ? element(base, bemElem) : base;

  var classes = [];
  if (className) {
    classes.push(className);
  }

  if (bemElem) {
    classes.push(element(base, bemElem));

    // handle mods
    if (bemMod) {
      Array.prototype.push.apply(classes, handleMods(baseClass, bemMod));
    }
  }

  // recurse for all children
  var updatedChildren = _react2['default'].Children.map(children, function (child) {
    return bemize(child, baseClass);
  });

  return _react2['default'].cloneElement(reactElement, { className: classes.join(' ') }, updatedChildren);
}

function handleMods(baseClass, bemMod) {
  if (typeof bemMod === 'string') {
    return [modifier(baseClass, bemMod)];
  }

  if (bemMod instanceof Array) {
    return bemMod.map(function (modClass) {
      return modifier(baseClass, modClass);
    });
  }

  if (typeof bemMod === 'object') {
    var mods = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(bemMod)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var modClass = _step.value;

        var predicate = bemMod[modClass];
        if (predicate) {
          mods.push(modifier(baseClass, modClass));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return mods;
  }

  throw new Error('unable to handle type of prop `bemMod`: ' + bemMod);
}
module.exports = exports['default'];

