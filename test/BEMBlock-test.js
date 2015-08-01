import React from 'react/addons';
import {expect} from 'chai';
import BEMBlock from '../BEMBlock';

const TestUtils = React.addons.TestUtils;

describe('BEMBlock', () => {
  const mods = {
    mod1 : true,
    mod2 : 1,
    mod3 : 'on',
    // falsy mods shouldn't make it to the class list
    mod4 : 0,
    mod5 : false,
    mod6 : ''
  };

  const block = (
    <BEMBlock blockName='TestComponent'>
      <span bemElem='text' bemMod={mods}></span>
      <img bemElem='image' bemMod={mods} />
    </BEMBlock>
  );

  let component, domNode;
  before(() => {
    component = TestUtils.renderIntoDocument(block);
    domNode = React.findDOMNode(component);
  });


  it('rendered with a className matching the block name', () => {
    expect(domNode.getAttribute('class')).to.contain('TestComponent');
  });

  it('rendered two children: a <span> and <img>', () => {
    const tags = [...domNode.children].map(node => node.tagName.toLowerCase());

    expect(tags).to.have.members(['img', 'span']);

  });

  it('rendered a <span> child has the correct classes', () => {
    const spanNode = [...domNode.children]
      .filter(node => node.tagName.toLowerCase() === 'span')[0];

    expect(spanNode.className.split(' ')).to.have.members([
      'TestComponent--text',
      'TestComponent--text__mod1',
      'TestComponent--text__mod2',
      'TestComponent--text__mod3'
    ]);
  });

  it('rendered a <img> child has the correct classes', () => {
    const imgNode = [...domNode.children]
      .filter(node => node.tagName.toLowerCase() === 'img')[0];

    expect(imgNode.className.split(' ')).to.have.members([
      'TestComponent--image',
      'TestComponent--image__mod1',
      'TestComponent--image__mod2',
      'TestComponent--image__mod3'
    ]);
  });
});
