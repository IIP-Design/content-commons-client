import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Popover.scss';

const Popover = props => {
  const {
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

  useEffect( () => {
    window.addEventListener( 'click', handleClick );
    window.addEventListener( 'scroll', handleScroll );
    return () => {
      window.removeEventListener( 'click', handleClick );
      window.removeEventListener( 'scroll', handleScroll );
    };
  }, [] );

  return (
    <span className="popover" ref={ popoverNode }>
      <button
        type="button"
        id="popoverButton"
        className="popover_trigger"
        aria-haspopup="true"
        aria-controls="package_documents_list"
        onClick={ () => setActive( !active ) }
      >
        { trigger }
      </button>
      { active && (
        <span
          className="popover_content"
          aria-labelledby="popoverButton"
        >
          { children }
        </span>
      ) }
    </span>
  );
};

Popover.propTypes = {
  trigger: PropTypes.oneOfType( [
    PropTypes.object,
    PropTypes.string
  ] ),
  children: PropTypes.object
};

export default Popover;
