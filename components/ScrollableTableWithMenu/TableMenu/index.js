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

  breakpoint = 767;

  componentDidMount = () => {
    this.menuHeadersOnMobile();
    window.addEventListener( 'keyup', this.handleKbdAccess );
    window.addEventListener( 'resize', this.menuHeadersOnResize );
  }

  componentWillUnmount = () => {
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
      if ( prevWindowWidth !== '' && prevWindowWidth <= this.breakpoint && !isWindowWidthLessThanOrEqualTo( this.breakpoint ) ) {
        return this.setState( { menuHeaders: [], windowWidth } );
      }
      if ( isWindowWidthLessThanOrEqualTo( this.breakpoint ) ) {
        const allMenuHeaders = this.props.columnMenu.map( menu => menu.label );
        return this.setState( { menuHeaders: [...allMenuHeaders], windowWidth } );
      }
      return this.setState( { windowWidth } );
    }, 500 );
  }

  handleKbdAccess = e => {
    const isTableMenu = e.target.dataset.tablemenu;
    const isItemsPerPage = e.target.id === 'items-per-page';

    if ( e.key === 'Escape' || ( isTableMenu && e.key === 'Shift' ) || ( isItemsPerPage && e.key === 'Shift' ) ) {
      this.setState( { displayTableMenu: false } );
    }
  }

  toggleTableMenu = () => {
    this.setState( prevState => ( {
      displayTableMenu: !prevState.displayTableMenu
    } ) );
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
                onClick={ this.toggleTableMenu }
              >
                Show More <VisuallyHidden el="span">columns</VisuallyHidden>
                <Icon name={ `angle ${displayTableMenu ? 'up' : 'down'}` } />
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
                      <li key={ item.name } role="menuitem">
                        <Checkbox
                          checked={ menuHeaders.includes( item.label ) }
                          data-proplabel={ item.label }
                          data-propname={ item.name }
                          data-tablemenuitem
                          id={ item.label }
                          label={ titleCase( item.label ) }
                          onChange={ tableMenuOnChange }
                          onClick={ this.toggleCheckbox }
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
