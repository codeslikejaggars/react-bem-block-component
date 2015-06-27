import React from 'react';
import _ from 'lodash';

export default class BEMBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      return bemize(child, this.props.blockName);
    });
  }

  render() {
    let { blockName, bemMods, elementType } = this.props;

    let blockClasses = [blockName];

    if(bemMod) {
      Array.prototype.push.apply(blockClasses, handleMods(blockName, bemMod));
    }

    return React.createElement(this.props.element, {
      className : blockClasses.join(' ')
    }, this._renderChildren());
  }
}

BEMBlock.propTypes = {
  elementType : React.PropTypes.oneOf(_.keys(React.DOM)),
  blockName : React.PropTypes.string.isRequired
};

BEMBlock.defaultProps = {
  elementType : React.DOM.div
};

const ELEM_SEPARATOR  = '__';
const MOD_SEPARATOR   = '--';

let makeMod = (base, mod) => base + MOD_SEPARATOR + mod;
let makeElem = (base, elem) => base + ELEM_SEPARATOR + elem;

function bemize(reactElement, base) {
  // skip if not a ReactElement or no bemElem prop
  if(!reactElement.props) {
    return reactElement;
  }

  let {bemElem, bemMod, children} = reactElement.props;

  let baseClass;
  if(bemElem) {
    baseClass = makeElem(base, bemElem);
  } else {
    baseClass = base;
  }

  // retain : reactElem.props.className;
  let classes = [];

  if(reactElement.props.className) {
    classes.push(reactElement.props.className);
  }

  if(bemElem) {
    classes.push(makeElem(base, bemElem));

    // handle mods
    if(bemMod) {
      Array.prototype.push.apply(classes, handleMods(baseClass, bemMod));
    }
  }

  // TODO check this doesn't cause stack overflows
  // recurse for all children
  let updatedChildren = React.Children.map(children, (child) => {
    return bemify(child, baseClass);
  });

  return React.cloneElement(reactElement, {
    className : [...new Set(classes)].join(' ')
  }, updatedChildren);
}

function handleMods(baseClass, bemMod) {
  // handle mods
  if (_.isString(bemMod)) {
    return [makeMod(baseClass, modClass)];
  }

  if (_.isArray(bemMod)) {
    return bemMod.map(modClass => makeMod(baseClass, modClass));
  }

  if(_.isObject(bemMod)) {
    return _(bemMod)
      .filter( predicate => predicate)
      .map   ((_, modClass) => makeMod(baseClass, modClass))
      .value ();
  }

  throw new Error('unable to handle type of prop `bemMod`: ' + bemMod);
}


