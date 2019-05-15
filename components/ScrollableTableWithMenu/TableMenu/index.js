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

  componentDidMount = () => {
    this.menuHeadersOnMobile();
    window.addEventListener( 'click', this.toggleTableMenu );
    window.addEventListener( 'keyup', this.handleKbdAccess );
    window.addEventListener( 'resize', this.menuHeadersOnResize );
  }

  componentWillUnmount = () => {
    window.removeEventListener( 'click', this.toggleTableMenu );
    window.removeEventListener( 'keyup', this.handleKbdAccess );
    window.removeEventListener( 'resize', this.menuHeadersOnResize );
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
    }, 500 );
  }

  handleKbdAccess = e => {
    const isTableMenu = e.target.dataset.tablemenu;
    const isItemsPerPage = e.target.id === 'items-per-page';
    const { displayTableMenu } = this.state;

    if ( !displayTableMenu ) return;

    if ( e.key === 'Escape' || ( isTableMenu && e.key === 'Shift' ) || ( isItemsPerPage && e.key === 'Shift' ) ) {
      this.setState( { displayTableMenu: false } );
    }
  }

  toggleTableMenu = e => {
    const isTableMenu = !!e.target.dataset.tablemenu;
    const isTableMenuItem = !!e.target.parentNode.dataset.tablemenuitem || !!e.target.dataset.tablemenuitem;
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

  handleTableScroll = e => {
    const itemsTable = document.querySelector( '.items_table' );
    const tableArrowDirection = e.target.dataset.tablearrow;
    if ( tableArrowDirection === 'right' ) {
      itemsTable.scrollLeft += 200;
    } else {
      itemsTable.scrollLeft -= 200;
    }
  }

  render() {
    const { displayTableMenu, menuHeaders } = this.state;
    const { columnMenu, tableMenuOnChange } = this.props;

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
                          role="menuitem"
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
          >
            <VisuallyHidden el="span">scroll table left</VisuallyHidden>
            <Icon name="angle left" data-tablearrow="left" />
          </button>
          <button
            data-tablearrow="right"
            onClick={ this.handleTableScroll }
            onFocus={ displayTableMenu ? this.toggleTableMenu : null }
            type="button"
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

export default TableMenu;
