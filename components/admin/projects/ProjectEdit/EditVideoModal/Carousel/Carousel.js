import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './Carousel.scss';

const Carousel = ( { callback, children, selectedItem } ) => {
  const [selected, setSelected] = useState( () => {
    let initialItem;
    children.forEach( ( child, index ) => {
      if ( child.props.id === selectedItem ) {
        initialItem = index;
      }
    } );
    return initialItem;
  } );
  const itemCount = children.length;

  const handleSelection = ( id, index ) => {
    callback( id );
    setSelected( index );
  };

  const handleButton = num => {
    const next = selected + num;
    const nextValue = children[next];

    callback( nextValue.props.id );
    setSelected( next );
  };

  return (
    <div className="carousel-container">
      <div className="carousel-items">
        { children.map( ( child, index ) => (
          <div
            className="carousel-item"
            key={ child.key }
            onClick={ () => handleSelection( child.props.id, index ) }
            onKeyUp={ () => handleSelection( child.props.id, index ) }
            role="button"
            tabIndex={ 0 }
          >
            { child }
          </div>
        ) ) }
      </div>
      <div className="carousel-legend">
        <button
          className="carousel-legend-button"
          disabled={ selected === 0 }
          onClick={ () => handleButton( -1 ) }
          type="button"
        >
          <Icon name="angle left" size="large" />
        </button>
        <div className="carousel-progress-bar">
          { children.map( ( child, index ) => {
            const isSelected = ( index === selected ) ? 'selected' : '';

            return (
              <div
                className={ `carousel-progress-item ${isSelected}` }
                key={ child.key }
                onClick={ () => handleSelection( child.props.id, index ) }
                onKeyUp={ () => handleSelection( child.props.id, index ) }
                role="button"
                tabIndex={ 0 }
              />
            );
          } ) }
        </div>
        <button
          className="carousel-legend-button"
          disabled={ selected === itemCount - 1 }
          onClick={ () => handleButton( 1 ) }
          type="button"
        >
          <Icon name="angle right" size="large" />
        </button>
      </div>
    </div>
  );
};

Carousel.propTypes = {
  callback: propTypes.func,
  children: propTypes.element,
  selectedItem: propTypes.string
};

export default Carousel;
