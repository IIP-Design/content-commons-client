import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './Carousel.scss';

const Carousel = ( {
  callback, children, legend, selectedItem, vertical
} ) => {
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

    const list = document.querySelector( '.carousel-items' );
    const listItem = document.querySelector( '.carousel-item' );
    const itemHeight = listItem.clientHeight;
    const itemWidth = listItem.clientWidth;
    const xVert = num > 0 ? itemWidth : -itemWidth;
    const yVert = num > 0 ? itemHeight : -itemHeight;
    const x = vertical ? 0 : xVert;
    const y = vertical ? yVert : 0;

    callback( nextValue.props.id );
    setSelected( next );
    list.scrollBy( x, y );
  };

  const isVertical = vertical ? 'vertical' : '';
  const withLegend = legend ? 'with-legend' : '';

  const viewportWidth = window.innerWidth || 0;
  const isMobile = viewportWidth < 991 ? 'mobile' : '';
  const onFirst = selected === 0 ? 'hidden' : '';
  const onLast = selected === itemCount - 1 ? 'hidden' : '';

  return (
    <div className={ `carousel-container ${isMobile}` }>
      { vertical && (
        <div
          className={ `scroll-button up ${isMobile} ${onFirst}` }
          onClick={ () => handleButton( -1 ) }
          onKeyUp={ () => handleButton( -1 ) }
          role="button"
          tabIndex={ 0 }
        >
          <i className="angle up icon scroll-icon" />
        </div>
      ) }
      <div className={ `carousel-content ${isMobile} ${isVertical}` }>
        <div className={ `carousel-items ${isMobile} ${isVertical} ${withLegend}` }>
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
        { legend && (
          <div className={ `carousel-legend ${isVertical}` }>
            { !vertical && (
              <button
                className="carousel-legend-button"
                disabled={ selected === 0 }
                onClick={ () => handleButton( -1 ) }
                type="button"
              >
                <Icon name="angle left" size="large" />
              </button>
            ) }
            <div className={ `carousel-progress-bar ${isVertical}` }>
              { children.map( ( child, index ) => {
                const isSelected = ( index === selected ) ? 'selected' : '';

                return (
                  <div
                    className={ `carousel-progress-item ${isSelected} ${isVertical}` }
                    key={ child.key }
                    onClick={ () => handleSelection( child.props.id, index ) }
                    onKeyUp={ () => handleSelection( child.props.id, index ) }
                    role="button"
                    tabIndex={ 0 }
                  />
                );
              } ) }
            </div>
            { !vertical && (
              <button
                className="carousel-legend-button"
                disabled={ selected === itemCount - 1 }
                onClick={ () => handleButton( 1 ) }
                type="button"
              >
                <Icon name="angle right" size="large" />
              </button>
            ) }
          </div>
        ) }
      </div>
      { vertical && (
        <div
          className={ `scroll-button down ${isMobile} ${onLast}` }
          onClick={ () => handleButton( 1 ) }
          onKeyUp={ () => handleButton( 1 ) }
          role="button"
          tabIndex={ 0 }
        >
          <i className="angle down icon scroll-icon" />
        </div>
      ) }
    </div>
  );
};

Carousel.propTypes = {
  callback: propTypes.func,
  children: propTypes.array,
  legend: propTypes.bool,
  selectedItem: propTypes.string,
  vertical: propTypes.bool
};

Carousel.defaultProps = {
  legend: true,
  vertical: false
};

export default Carousel;
