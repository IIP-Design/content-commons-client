/**
 *
 * TableMenu
 *
 */

import React, { useRef, useState, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Checkbox, Icon, Menu } from 'semantic-ui-react';

import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { isMobile, isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import { titleCase } from 'lib/utils';

import './TableMenu.scss';

const TableMenu = ( { columnMenu, tableMenuOnChange } ) => {
  const refs = useRef( columnMenu.map( () => createRef() ) );

  const [displayTableMenu, setDisplayTableMenu] = useState( false );
  const [menuHeaders, setMenuHeaders] = useState( [] );
  const [windowWidth, setWindowWidth] = useState( '' );

  const _breakpoint = 767;
  const _scrollPixels = 200;
  const _timeOutDelay = 500;

  const getColumns = () => columnMenu.reduce( ( acc, cur ) => [...acc, cur.label], [] );

  const handleCheckboxFocus = ( array, i ) => {
    console.log( array, i );
    // this[array[i]].inputRef.current.focus();
  };

  const handleCloseMenu = () => setDisplayTableMenu( false );

  const handleKbdAccess = e => {
    console.log( displayTableMenu );
    if ( !displayTableMenu ) return;

    if ( [
      'Home', 'End', 'ArrowDown', 'ArrowUp',
    ].indexOf( e.key ) > -1 ) {
      e.preventDefault();
    }

    const columns = getColumns();
    const current = columns.indexOf( e.target.id );
    const first = 0;
    const last = columns.length - 1;
    const next = current + 1;
    const previous = current - 1;
    const isCheckbox = e.target.type === 'checkbox';

    let i;

    switch ( e.key ) {
      case 'Escape':
        handleCloseMenu();
        break;

      case 'Tab':
        if ( isCheckbox ) handleCloseMenu();
        break;

      case 'ArrowDown':
        i = current === last ? first : next;
        handleCheckboxFocus( columns, i );
        break;

      case 'ArrowUp':
        i = current === first ? last : previous;
        handleCheckboxFocus( columns, i );
        break;

      case 'Home':
        handleCheckboxFocus( columns, first );
        break;

      case 'End':
        handleCheckboxFocus( columns, last );
        break;

      default:
        break;
    }
  };

  const handleTableScroll = e => {
    const itemsTable = document.querySelector( '.items_table' );
    const tableArrowDirection = e.target.dataset.tablearrow;

    if ( tableArrowDirection === 'right' ) {
      itemsTable.scrollLeft += _scrollPixels;
    } else {
      itemsTable.scrollLeft -= _scrollPixels;
    }
  };

  const toggleTableMenu = e => {
    const { dataset, id, parentNode } = e.target;

    const isTableMenu = !!dataset.tablemenu;
    const isTableMenuItem = parentNode && ( !!parentNode.dataset.tablemenuitem || !!dataset.tablemenuitem );
    const isShowMoreColumns = id === 'show-more-columns';

    console.log( dataset, id, parentNode );
    console.log( 'table menu: ', isTableMenu );

    if ( isTableMenu ) {
      const displayState = displayTableMenu;

      setDisplayTableMenu( !displayState );
    } else if ( isTableMenuItem || isShowMoreColumns ) {
      setDisplayTableMenu( true );
    } else {
      setDisplayTableMenu( false );
    }
  };

  const toggleCheckbox = ( e, data ) => {
    const selectedCheckbox = data['data-proplabel'];

    if ( menuHeaders.includes( selectedCheckbox ) ) {
      setMenuHeaders( menuHeaders.filter( header => header !== selectedCheckbox ) );
    } else {
      setMenuHeaders( [...menuHeaders, selectedCheckbox] );
    }
  };

  const menuHeadersOnMobile = () => {
    const allMenuHeaders = columnMenu.map( menu => menu.label );

    if ( isMobile() ) {
      setMenuHeaders( [...allMenuHeaders] );
    }
  };

  const menuHeadersOnResize = () => {
    const { innerWidth } = window;

    let resizeMenuHeadersTimer = null;

    if ( resizeMenuHeadersTimer !== null ) clearTimeout( resizeMenuHeadersTimer );

    resizeMenuHeadersTimer = setTimeout( () => {
      if ( windowWidth !== '' && windowWidth <= _breakpoint && !isWindowWidthLessThanOrEqualTo( _breakpoint ) ) {
        setMenuHeaders( [] );
      }

      if ( isWindowWidthLessThanOrEqualTo( _breakpoint ) ) {
        const allMenuHeaders = columnMenu.map( menu => menu.label );

        setMenuHeaders( [...allMenuHeaders] );
      }

      setWindowWidth( innerWidth );
    }, _timeOutDelay );
  };

  useEffect( () => {
    menuHeadersOnMobile();
    window.addEventListener( 'click', toggleTableMenu );
    window.addEventListener( 'keydown', handleKbdAccess );
    window.addEventListener( 'resize', menuHeadersOnResize );

    return () => {
      window.removeEventListener( 'click', toggleTableMenu );
      window.removeEventListener( 'keydown', handleKbdAccess );
      window.removeEventListener( 'resize', menuHeadersOnResize );
    };
  }, [] );

  const isTableScrollable = menuHeaders.length >= 2;

  return (
    <div className="items_menu_wrapper">
      <div className={ displayTableMenu ? 'items_menu active' : 'items_menu' }>
        <Accordion as={ Menu } vertical>
          <Menu.Item>
            <Accordion.Title
              active={ !displayTableMenu }
              aria-controls="show-more-columns"
              aria-expanded={ displayTableMenu }
              aria-haspopup
              as="button"
              data-tablemenu
              id="show-more-btn"
            >
              Show More
              {' '}
              <VisuallyHidden el="span">columns</VisuallyHidden>
              <Icon
                data-tablemenu
                name={ `angle ${displayTableMenu ? 'up' : 'down'}` }
              />
            </Accordion.Title>
            { displayTableMenu
                && (
                  <Accordion.Content
                    active={ displayTableMenu }
                    aria-hidden={ !displayTableMenu }
                    aria-labelledby="show-more-btn"
                    as="ul"
                    id="show-more-columns"
                    role="menu"
                  >
                    { columnMenu.map( ( item, idx ) => (
                      <li key={ item.name }>
                        <Checkbox
                          checked={ menuHeaders.includes( item.label ) }
                          data-proplabel={ item.label }
                          data-propname={ item.name }
                          data-tablemenuitem
                          id={ item.label }
                          label={ titleCase( item.label ) }
                          onChange={ tableMenuOnChange }
                          onClick={ toggleCheckbox }
                          ref={ refs.current[idx] }
                          role="menuitem"
                          tabIndex="-1"
                        />
                      </li>
                    ) ) }
                  </Accordion.Content>
                ) }
          </Menu.Item>
        </Accordion>

        <button
          data-tablearrow="left"
          onClick={ handleTableScroll }
          onFocus={ displayTableMenu ? toggleTableMenu : null }
          type="button"
          disabled={ !isTableScrollable }
        >
          <VisuallyHidden el="span">scroll table left</VisuallyHidden>
          <Icon name="angle left" data-tablearrow="left" />
        </button>
        <button
          data-tablearrow="right"
          onClick={ handleTableScroll }
          onFocus={ displayTableMenu ? toggleTableMenu : null }
          type="button"
          disabled={ !isTableScrollable }
        >
          <VisuallyHidden el="span">scroll table right</VisuallyHidden>
          <Icon name="angle right" data-tablearrow="right" />
        </button>
      </div>
    </div>
  );
};

TableMenu.propTypes = {
  columnMenu: PropTypes.array,
  tableMenuOnChange: PropTypes.func,
};

TableMenu.defaultProps = {
  columnMenu: [],
};

export default TableMenu;
