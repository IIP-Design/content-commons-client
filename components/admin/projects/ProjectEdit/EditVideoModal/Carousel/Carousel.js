/**
 *
 * Carousel
 *
 */
import React, { useState, useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './Carousel.scss';

const Carousel = ( {
  children, legend, selectedItem, vertical
} ) => {
  // Get the index of the initially selected item based on the id of the selectedItem prop
  const getSelectedIndex = elems => {
    let initialItem = 0;
    elems.forEach( ( elem, index ) => {
      if ( elem.props.id === selectedItem ) {
        initialItem = index;
      }
    } );
    return initialItem;
  };
  // Get number of items in items list
  const itemCount = children.length;

  // Set ref for the carousel items
  const carouselItems = useRef( null );

  // If true disables the previous button
  const [disablePrev, setDisablePrev] = useState( () => {
    const num = getSelectedIndex( children ) + 1;
    const disable = num < 4;
    return disable;
  } );

  // If true disables the next button
  const [disableNext, setDisableNext] = useState( () => {
    const num = getSelectedIndex( children ) + 1;
    const disable = ( itemCount - num ) === 0;
    return disable;
  } );

  // Accept a target list item and the number of scrolls over
  const manipulateList = ( list, offset ) => {
    // Determine scroll amount based on child size
    const x = vertical ? 0 : offset;
    const y = vertical ? offset : 0;

    // Scroll to correct position
    list.scrollBy( x, y );

    // Calculate space left to scroll to the right and bottom
    const scrollRight = list.scrollWidth - ( list.clientWidth + list.scrollLeft );
    const scrollBottom = list.scrollHeight - ( list.clientHeight + list.scrollTop );

    // Disable scroll buttons if there is no room left to scroll
    if ( !vertical ) {
      if ( list.scrollLeft === 0 ) {
        setDisablePrev( true );
      } else {
        setDisablePrev( false );
      }

      if ( scrollRight === 0 ) {
        setDisableNext( true );
      } else {
        setDisableNext( false );
      }
    }

    if ( vertical ) {
      if ( list.scrollTop === 0 ) {
        setDisablePrev( true );
      } else {
        setDisablePrev( false );
      }

      if ( scrollBottom === 0 ) {
        setDisableNext( true );
      } else {
        setDisableNext( false );
      }
    }
  };

  // Calculate how many over to scroll
  const calcScrollAmount = ( index, items ) => {
    const countPrev = index;
    const countNext = items - ( index + 1 );
    let num;
    if ( countPrev > 2 ) {
      num = countPrev - 2;
    } else if ( countNext > 2 ) {
      num = 2 - countNext;
    }

    return num;
  };

  // Dynamically calculate the pixel scroll based on item width
  const calcOffset = ( list, num ) => {
    const listItem = list.firstChild;
    const xOffset = listItem.clientWidth * num;
    const yOffset = listItem.clientHeight * num;
    const offset = vertical ? yOffset : xOffset;

    return offset;
  };

  // Bring item into view if selected
  const scrollToSelected = index => {
    const list = carouselItems.current;
    if ( index === undefined || !list ) { return; }

    const items = list.children.length;
    const num = calcScrollAmount( index, items );

    if ( num ) {
      const offset = calcOffset( list, num );
      manipulateList( list, offset );
    }
  };

  // Sets the selected carousel item
  const [selected, setSelected] = useState( () => {
    const selectedIndex = getSelectedIndex( children );
    return selectedIndex;
  } );

  useEffect( () => {
    const selectedIndex = getSelectedIndex( children );
    scrollToSelected( selectedIndex );
  }, [children] );

  const handleSelection = ( id, index ) => {
    setSelected( index );
    scrollToSelected( index );
  };

  const handleButton = e => {
    const list = carouselItems.current;
    const num = parseInt( e.target.dataset.scroll, 10 );
    const offset = calcOffset( list, num );

    manipulateList( list, offset );
  };

  const isVertical = vertical ? 'vertical' : '';
  const withLegend = legend ? 'with-legend' : '';
  const carouselItemStyle = vertical ? { width: '100%', height: '32%' } : { width: '32%' };

  const viewportWidth = window.innerWidth || 0;
  const isMobile = viewportWidth < 991 ? 'mobile' : '';
  const onFirst = disablePrev ? 'hidden' : '';
  const onLast = disableNext ? 'hidden' : '';
  const showButtons = itemCount > 3;

  return (
    <div className={ `carousel-container ${isMobile}` }>
      { vertical && showButtons && (
        <div
          className={ `scroll-button up ${isMobile} ${onFirst}` }
          data-scroll={ -1 }
          onClick={ handleButton }
          onKeyUp={ handleButton }
          role="button"
          tabIndex={ 0 }
        >
          <i className="angle up icon scroll-icon" data-scroll={ -1 } />
        </div>
      ) }
      <div className={ `carousel-content ${isMobile} ${isVertical}` } style={ showButtons ? { margin: '0' } : { margin: '24px 0' } }>
        <div className={ `carousel-items ${isMobile} ${isVertical} ${withLegend}` } ref={ carouselItems }>
          { children.map( ( child, index ) => (
            <div
              className="carousel-item"
              key={ child.key }
              onClick={ () => handleSelection( child.props.id, index ) }
              onKeyUp={ () => handleSelection( child.props.id, index ) }
              style={ carouselItemStyle }
              role="button"
              tabIndex={ 0 }
            >
              { child }
            </div>
          ) ) }
        </div>
        { legend && showButtons && (
          <div className={ `carousel-legend ${isVertical}` }>
            { ( !vertical ) && (
              <button
                className="carousel-legend-button"
                data-scroll={ -1 }
                disabled={ disablePrev }
                onClick={ handleButton }
                type="button"
              >
                <Icon data-scroll={ -1 } name="angle left" size="large" />
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
                data-scroll={ 1 }
                disabled={ disableNext }
                onClick={ handleButton }
                type="button"
              >
                <Icon data-scroll={ 1 } name="angle right" size="large" />
              </button>
            ) }
          </div>
        ) }
      </div>
      { vertical && showButtons && (
        <div
          className={ `scroll-button down ${isMobile} ${onLast}` }
          data-scroll={ 1 }
          onClick={ handleButton }
          onKeyUp={ handleButton }
          role="button"
          tabIndex={ 0 }
        >
          <i className="angle down icon scroll-icon" data-scroll={ 1 } />
        </div>
      ) }
    </div>
  );
};

Carousel.propTypes = {
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
