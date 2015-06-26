'use strict';

import React from 'react';
import autoBindMethods from 'auto-bind-methods';
import _ from 'lodash';

const ELEM_SEPARATOR = '__';
const MOD_SEPARATOR = '--';

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
      if (_.isString(bemMod)) {
        classes.push(child.props.bemMods);

      } else if (_.isArray(bemMod)) {
        Array.prototype.push.apply(classes, bemMod);

      } else if(_.isObject(bemMod)) {
        _.forEach(bemMod, (predicate, modClass) => {
          if(predicate) {
            classes.push(makeMod(baseClass, modClass));
          }
        });
      }
    }
  }

  // TODO check this doesn't cause stack overflows
  // recurse for all children
  let updatedChildren = React.Children.map(children, (child) => {
    return bemize(child, baseClass);
  });

  return React.cloneElement(reactElement, {
    className : classes.join(' ')
  }, updatedChildren);
}



export default class BEMBlock extends React.Component {
  constructor(props) {
    super(props);

    autoBindMethods(this);
  }

  _renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      return bemize(child, this.props.blockName);
    });
  }

  render() {
    return (
      <div className={this.props.blockName}>{this._renderChildren()}</div>
    );
  }
}

BEMBlock.propTypes = {
  blockName : React.PropTypes.string.isRequired
};
