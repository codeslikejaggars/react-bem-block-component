Example usage:

    import React from 'react';
    import BEMBlock from 'react-bem-block-component';

    class PersonComponent extends React.Component {
      render() {
        return (
          <BEMBlock blockName='PersonComponent'>
            <span bemElem='name' bemMods={{
              active : this.props.isActive  
            }}>{'John Candy'}</span>
          </BEMBlock>
        );
      }
    }

The rendered output looks like this if `this.props.isActive` is truthy:

    <div class='PersonComponent'>
      <span class='PersonComponent__name PersonComponent__name--active'>
        John Candy
      </span>
    </div>

Or, if `this.props.isActive` is falsy:

    <div class='PersonComponent'>
      <span class='PersonComponent__name'>
        John Candy
      </span>
    </div>
