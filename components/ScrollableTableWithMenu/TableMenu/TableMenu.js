/**
 *
 * TableMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion, Checkbox, Icon, Menu
} from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { titleCase } from 'lib/utils';
import { isMobile, isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import './TableMenu.scss';

class TableMenu extends React.Component {
  state = {
    displayTableMenu: false,
    menuHeaders: [],
    windowWidth: ''
  }

  _breakpoint = 767;

  _scrollPixels = 200;

  _timeOutDelay = 500;

  componentDidMount = () => {
    this.menuHeadersOnMobile();
    window.addEventListener( 'click', this.toggleTableMenu );
    window.addEventListener( 'keydown', this.handleKbdAccess );
    window.addEventListener( 'resize', this.menuHeadersOnResize );
  }

  componentDidUpdate = ( _, prevState ) => {
    if ( !prevState.displayTableMenu && this.state.displayTableMenu ) {
      const columns = this.getColumns();
      this.handleCheckboxFocus( columns, 0 );
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener( 'click', this.toggleTableMenu );
    window.removeEventListener( 'keydown', this.handleKbdAccess );
    window.removeEventListener( 'resize', this.menuHeadersOnResize );
  }

  setRef = ( node, ref ) => {
    this[ref] = node;
  }

  getColumns = () => (
    this.props.columnMenu.reduce( ( acc, cur ) => (
      [...acc, cur.label]
    ), [] )
  )

  handleCheckboxFocus = ( array, i ) => {
    this[array[i]].inputRef.focus();
  };

  handleCloseMenu = () => this.setState( { displayTableMenu: false } );

  handleKbdAccess = e => {
    if ( !this.state.displayTableMenu ) return;

    if ( ['Home', 'End', 'ArrowDown', 'ArrowUp'].indexOf( e.key ) > -1 ) {
      e.preventDefault();
    }

    const columns = this.getColumns();
    const current = columns.indexOf( e.target.id );
    const first = 0;
    const last = columns.length - 1;
    const next = current + 1;
    const previous = current - 1;
    const isCheckbox = e.target.type === 'checkbox';

    let i;
    switch ( e.key ) {
      case 'Escape':
        this.handleCloseMenu();
        break;

      case 'Tab':
        if ( isCheckbox ) this.handleCloseMenu();
        break;

      case 'ArrowDown':
        i = current === last ? first : next;
        this.handleCheckboxFocus( columns, i );
        break;

      case 'ArrowUp':
        i = current === first ? last : previous;
        this.handleCheckboxFocus( columns, i );
        break;

      case 'Home':
        this.handleCheckboxFocus( columns, first );
        break;

      case 'End':
        this.handleCheckboxFocus( columns, last );
        break;

      default:
        break;
    }
  }

  handleTableScroll = e => {
    const itemsTable = document.querySelector( '.items_table' );
    const tableArrowDirection = e.target.dataset.tablearrow;
    if ( tableArrowDirection === 'right' ) {
      itemsTable.scrollLeft += this._scrollPixels;
    } else {
      itemsTable.scrollLeft -= this._scrollPixels;
    }
  }

  toggleTableMenu = e => {
    const isTableMenu = !!e.target.dataset.tablemenu;
    const isTableMenuItem = ( e.target.parentNode && !!e.target.parentNode.dataset.tablemenuitem ) || !!e.target.dataset.tablemenuitem;
    const isShowMoreColumns = e.target.id === 'show-more-columns';

    this.setState( prevState => {
      if ( isTableMenu ) {
        return { displayTableMenu: !prevState.displayTableMenu };
      }

      if ( isTableMenuItem || isShowMoreColumns ) {
        return { displayTableMenu: true };
      }

      return { displayTableMenu: false };
    } );
  }

  toggleCheckbox = ( e, data ) => {
    const selectedCheckbox = data[`data-proplabel`];
    const { menuHeaders } = this.state;

    this.setState( prevState => {
      if ( menuHeaders.includes( selectedCheckbox ) ) {
        return {
          menuHeaders: prevState.menuHeaders.filter( header => header !== selectedCheckbox )
        };
      }
      return {
        menuHeaders: [...prevState.menuHeaders, selectedCheckbox]
      };
    } );
  }

  menuHeadersOnMobile = () => {
    const allMenuHeaders = this.props.columnMenu.map( menu => menu.label );
    if ( isMobile() ) {
      this.setState( {
        menuHeaders: [...allMenuHeaders]
      } );
    }
  }

  menuHeadersOnResize = () => {
    const windowWidth = window.innerWidth;
    const prevWindowWidth = this.state.windowWidth;

    let resizeMenuHeadersTimer = null;
    if ( resizeMenuHeadersTimer !== null ) clearTimeout( resizeMenuHeadersTimer );
    resizeMenuHeadersTimer = setTimeout( () => {
      if ( prevWindowWidth !== '' && prevWindowWidth <= this._breakpoint && !isWindowWidthLessThanOrEqualTo( this._breakpoint ) ) {
        return this.setState( { menuHeaders: [], windowWidth } );
      }
      if ( isWindowWidthLessThanOrEqualTo( this._breakpoint ) ) {
        const allMenuHeaders = this.props.columnMenu.map( menu => menu.label );
        return this.setState( { menuHeaders: [...allMenuHeaders], windowWidth } );
      }
      return this.setState( { windowWidth } );
    }, this._timeOutDelay );
  }

  render() {
    const { displayTableMenu, menuHeaders } = this.state;
    const { columnMenu, tableMenuOnChange } = this.props;
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
                Show More <VisuallyHidden el="span">columns</VisuallyHidden>
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
                    { columnMenu.map( item => (
                      <li key={ item.name }>
                        <Checkbox
                          checked={ menuHeaders.includes( item.label ) }
                          data-proplabel={ item.label }
                          data-propname={ item.name }
                          data-tablemenuitem
                          id={ item.label }
                          label={ titleCase( item.label ) }
                          onChange={ tableMenuOnChange }
                          onClick={ this.toggleCheckbox }
                          ref={ node => this.setRef( node, item.label ) }
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
            onClick={ this.handleTableScroll }
            onFocus={ displayTableMenu ? this.toggleTableMenu : null }
            type="button"
            disabled={ !isTableScrollable }
          >
            <VisuallyHidden el="span">scroll table left</VisuallyHidden>
            <Icon name="angle left" data-tablearrow="left" />
          </button>
          <button
            data-tablearrow="right"
            onClick={ this.handleTableScroll }
            onFocus={ displayTableMenu ? this.toggleTableMenu : null }
            type="button"
            disabled={ !isTableScrollable }
          >
            <VisuallyHidden el="span">scroll table right</VisuallyHidden>
            <Icon name="angle right" data-tablearrow="right" />
          </button>
        </div>
      </div>
    );
  }
}

TableMenu.propTypes = {
  columnMenu: PropTypes.array,
  tableMenuOnChange: PropTypes.func
};

TableMenu.defaultProps = {
  columnMenu: []
};

export default TableMenu;
