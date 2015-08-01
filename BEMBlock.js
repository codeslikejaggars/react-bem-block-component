import React from 'react';

export default class BEMBlock extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return React.createElement(this.props.elementType, {
      className : this._blockClass()
    }, this._renderChildren());
  }

  // returns the class name for the block
  _blockClass() {
    let { blockName, bemMod } = this.props;
    let blockClasses = [blockName];

    if(bemMod) {
      blockClasses.push(...handleMods(blockName, bemMod));
    }

    return blockClasses.join(' ');
  }

  // render
  _renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      return bemize(child, this.props.blockName);
    });
  }
}

BEMBlock.propTypes = {
  elementType : React.PropTypes.oneOf(Object.keys(React.DOM)),
  blockName : React.PropTypes.string.isRequired
};

BEMBlock.defaultProps = {
  elementType : 'div'
};


// === utilities ===

const modifier = (base, mod) => base + '__' + mod;
const element = (base, elem) => base + '--' + elem;

function bemize(reactElement, base) {
  // skip if not a ReactElement or no bemElem prop
  if(!reactElement.props) {
    return reactElement;
  }

  const {className, bemElem, bemMod, children} = reactElement.props;
  const baseClass = bemElem ? element(base, bemElem): base;

  const classes = [];
  if(className) {
    classes.push(className);
  }

  if(bemElem) {
    classes.push(element(base, bemElem));

    // handle mods
    if(bemMod) {
      Array.prototype.push.apply(classes, handleMods(baseClass, bemMod));
    }
  }

  // recurse for all children
  const updatedChildren = React.Children.map(children, (child) => {
    return bemize(child, baseClass);
  });

  return React.cloneElement(reactElement,
    {className : classes.join(' ')}, updatedChildren);
}

function handleMods(baseClass, bemMod) {
  if(typeof bemMod === 'string') {
    return [ modifier(baseClass, bemMod) ];
  }

  if(bemMod instanceof Array) {
    return bemMod.map(modClass => modifier(baseClass, modClass));
  }

  if(typeof bemMod === 'object') {
    let mods = [];
    for(let modClass of Object.keys(bemMod)) {
      let predicate = bemMod[modClass];
      if(predicate) {
        mods.push(modifier(baseClass, modClass));
      }
    }
    return mods;
  }

  throw new Error('unable to handle type of prop `bemMod`: ' + bemMod);
}
