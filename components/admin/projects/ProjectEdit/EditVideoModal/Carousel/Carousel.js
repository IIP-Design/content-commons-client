/**
 *
 * Carousel
 *
 */
import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './Carousel.scss';

const Carousel = ( {
  callback, children, legend, selectedItem, vertical
} ) => {
  const getSelectedIndex = elems => {
    let initialItem;
    elems.forEach( ( elem, index ) => {
      if ( elem.props.id === selectedItem ) {
        initialItem = index;
      }
    } );
    return initialItem;
  };
  const itemCount = children.length;

  const [selected, setSelected] = useState( () => {
    const selectedIndex = getSelectedIndex( children );
    // scrollToSelected( selectedIndex );
    return selectedIndex;
  } );

  const [disablePrev, setDisablePrev] = useState( () => {
    const num = getSelectedIndex( children ) + 1;
    const disable = num < 4;
    return disable;
  } );

  const [disableNext, setDisableNext] = useState( () => {
    const num = getSelectedIndex( children ) + 1;
    const disable = ( itemCount - num ) === 0;
    return disable;
  } );

  const psuedoRandomId = `carousel-items-${selectedItem}`;

  const manipulateList = ( list, num ) => {
    const listItem = list.firstChild;
    const xOffset = listItem.clientWidth * num;
    const yOffset = listItem.clientHeight * num;
    const x = vertical ? 0 : xOffset;
    const y = vertical ? yOffset : 0;

    list.scrollBy( x, y );

    const scrollRight = list.scrollWidth - ( list.clientWidth + list.scrollLeft );
    const scrollBottom = list.scrollHeight - ( list.clientHeight + list.scrollTop );

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

  const scrollToSelected = index => {
    const list = document.getElementById( psuedoRandomId );
    const countPrev = index;
    const countNext = list.children.length - ( index + 1 );
    let num;
    if ( countPrev > 2 ) {
      num = countPrev - 2;
    } else if ( countNext > 2 ) {
      num = 2 - countNext;
    }

    if ( num ) {
      manipulateList( list, num );
    }
  };

  const handleSelection = ( id, index ) => {
    callback( id );
    setSelected( index );
    scrollToSelected( index );
  };

  const handleButton = e => {
    const num = parseInt( e.target.dataset.scroll, 10 );

    const getList = el => {
      const button = el.className.includes( 'angle' ) ? e.target.parentNode : e.target;

      let items;
      const classes = el.className;
      if ( classes.includes( 'up' ) ) {
        const sibling = button.nextSibling;
        items = sibling.firstChild;
      } else if ( classes.includes( 'down' ) ) {
        const sibling = button.previousSibling;
        items = sibling.firstChild;
      } else {
        const parent = button.parentNode;
        items = parent.previousSibling;
      }

      return items;
    };

    const list = getList( e.target );
    manipulateList( list, num );
  };

  const isVertical = vertical ? 'vertical' : '';
  const withLegend = legend ? 'with-legend' : '';
  const carouselItemStyle = vertical ? { width: '100%', height: '32%' } : { width: '32%' };

  const viewportWidth = window.innerWidth || 0;
  const isMobile = viewportWidth < 991 ? 'mobile' : '';
  const onFirst = disablePrev ? 'hidden' : '';
  const onLast = disableNext ? 'hidden' : '';

  return (
    <div className={ `carousel-container ${isMobile}` }>
      { ( vertical && itemCount > 3 ) && (
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
      <div className={ `carousel-content ${isMobile} ${isVertical}` }>
        <div className={ `carousel-items ${isMobile} ${isVertical} ${withLegend}` } id={ psuedoRandomId }>
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
        { legend && (
          <div className={ `carousel-legend ${isVertical}` }>
            { ( !vertical && itemCount > 3 ) && (
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
            { ( !vertical && itemCount > 3 ) && (
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
      { ( vertical && itemCount > 3 ) && (
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
  callback: propTypes.func,
  children: propTypes.array,
  legend: propTypes.bool,
  selectedItem: propTypes.string,
  vertical: propTypes.bool
};

Carousel.defaultProps = {
  callback: () => {},
  legend: true,
  vertical: false
};

export default Carousel;
