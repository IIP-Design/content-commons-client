import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Popover.scss';

const Popover = props => {
  const {
    id,
    className,
    expandFromRight,
    trigger,
    children,
    toolTip
  } = props;

  const popoverNode = useRef();

  const [active, setActive] = useState( false );

  const handleClick = e => {
    if ( popoverNode.current?.contains( e.target ) ) return;
    setActive( false );
  };

  const handleScroll = () => setActive( false );

  const handleKeyDown = e => {
    if ( e.key === 'Esc' || e.key === 'Escape' ) setActive( false );
  };

  useEffect( () => {
    window.addEventListener( 'click', handleClick );
    window.addEventListener( 'scroll', handleScroll );
    window.addEventListener( 'keydown', handleKeyDown );

    return () => {
      window.removeEventListener( 'click', handleClick );
      window.removeEventListener( 'scroll', handleScroll );
      window.removeEventListener( 'keydown', handleKeyDown );
    };
  }, [] );

  return (
    <span className={ `popover ${className}` } ref={ popoverNode }>
      <button
        type="button"
        id={ `popoverButton_${id}` }
        className="popover_trigger"
        aria-haspopup="true"
        aria-expanded={ active } // active state determines if popover content expanded
        aria-controls="popoverContent"
        onClick={ () => setActive( !active ) }
        tooltip={ toolTip }
      >
        { trigger }
      </button>
      { active && (
        <span
          id={ `popoverContent_${id}` }
          className={ expandFromRight ? 'popover_content expandFromRight' : 'popover_content' }
          aria-labelledby={ `popoverButton_${id}` }
          aria-hidden={ !active }
        >
          { children }
        </span>
      ) }
    </span>
  );
};

Popover.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  expandFromRight: PropTypes.bool,
  trigger: PropTypes.oneOfType( [
    PropTypes.object,
    PropTypes.string
  ] ),
  children: PropTypes.object,
  toolTip: PropTypes.string
};

export default Popover;
