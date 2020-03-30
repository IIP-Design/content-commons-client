import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import './ContentHeightClamp.scss';

const ContentHeightClamp = props => {
  const {
    children, className, el: Element, maxHeight, style
  } = props;
  const [height, setHeight] = useState( 0 );

  const ref = useCallback( node => {
    if ( node !== null ) {
      setHeight( node.getBoundingClientRect().height );
    }
  }, [] );

  return (
    <Element
      ref={ ref }
      className={ `height-clamp ${className} ${height > maxHeight ? 'clamped' : 'unclamped'}` }
      style={ style }
    >
      { children }
    </Element>
  );
};

ContentHeightClamp.defaultProps = {
  el: 'div',
  maxHeight: 144,
  style: {}
};

ContentHeightClamp.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  el: PropTypes.string,
  maxHeight: PropTypes.number,
  style: PropTypes.object
};

export default ContentHeightClamp;
