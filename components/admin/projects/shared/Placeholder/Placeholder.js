/**
 *
 * Placeholder
 *
 */

import React from 'react';
import { object, string } from 'prop-types';

import colors from 'styles/colors.scss';

const Placeholder = props => {
  const {
    parentEl,
    childEl,
    parentStyles,
    childStyles
  } = props;

  const Parent = parentEl;
  const Child = childEl;
  const baseStyle = {
    height: '0.875em',
    width: 'auto',
    marginBottom: '0.625em',
    backgroundColor: colors.altGrey
  };

  const childStylesKeys = Object.keys( childStyles );

  const renderChildEl = key => (
    <Child
      key={ key }
      style={ { ...baseStyle, ...childStyles[key] } }
    />
  );

  return (
    <Parent className="placeholder" style={ parentStyles }>
      { childStylesKeys.map( renderChildEl ) }
    </Parent>
  );
};

Placeholder.propTypes = {
  parentEl: string,
  childEl: string,
  parentStyles: object,
  childStyles: object
};

Placeholder.defaultProps = {
  parentEl: 'li',
  childEl: 'div',
  parentStyles: {},
  childStyles: { default: { width: 'auto' } }
};

export default Placeholder;
