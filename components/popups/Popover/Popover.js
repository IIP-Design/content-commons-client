import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Popover.scss';

const Popover = props => {
  const {
    className,
    trigger,
    children
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
    <span className={ className ? `popover ${className}` : 'popover' } ref={ popoverNode }>
      <button
        type="button"
        id="popoverTrigger"
        className="popover_trigger"
        aria-haspopup="true"
        aria-expanded={ active } // active state determines if popover content expanded
        aria-controls="popoverContent"
        onClick={ () => setActive( !active ) }
      >
        { trigger }
      </button>
      { active && (
        <span
          id="popoverContent"
          className="popover_content"
          aria-labelledby="popoverButton"
          aria-hidden={ !active }
        >
          { children }
        </span>
      ) }
    </span>
  );
};

Popover.propTypes = {
  className: PropTypes.string,
  trigger: PropTypes.oneOfType( [
    PropTypes.object,
    PropTypes.string
  ] ),
  children: PropTypes.object
};

export default Popover;
