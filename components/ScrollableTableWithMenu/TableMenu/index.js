/**
 *
 * TableMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Icon } from 'semantic-ui-react';
import { titleCase } from 'lib/utils';
import { isMobile, isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import './TableMenu.scss';

class TableMenu extends React.Component {
  state = {
    displayTableMenu: false,
    menuHeaders: [],
    windowWidth: ''
  }

  componentDidMount() {
    document.addEventListener( 'click', this.toggleTableMenu, false );
    this.menuHeadersOnMobile();
    window.addEventListener( 'resize', this.menuHeadersOnResize );
  }

  componentWillUnmount() {
    document.removeEventListener( 'click', this.toggleTableMenu, false );
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
      if ( prevWindowWidth !== '' && prevWindowWidth <= 767 && !isWindowWidthLessThanOrEqualTo( 767 ) ) {
        return this.setState( { menuHeaders: [], windowWidth } );
      }
      if ( isWindowWidthLessThanOrEqualTo( 767 ) ) {
        const allMenuHeaders = this.props.columnMenu.map( menu => menu.label );
        return this.setState( { menuHeaders: [...allMenuHeaders], windowWidth } );
      }
      return this.setState( { windowWidth } );
    }, 500 );
  }

  toggleTableMenu = e => {
    const isTableMenu = e.target.dataset.tablemenu;
    const isTableMenuItem = e.target.parentNode ? e.target.parentNode.dataset.tablemenuitem : null;

    if ( isTableMenu ) {
      return this.setState( prevState => ( { displayTableMenu: !prevState.displayTableMenu } ) );
    }

    if ( isTableMenuItem ) {
      return this.setState( { displayTableMenu: true } );
    }

    return this.setState( { displayTableMenu: false } );
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
          <span data-tablemenu>See More <Icon data-tablemenu name="angle down" /></span>
          <span
            role="button"
            data-tablearrow="left"
            onClick={ this.handleTableScroll }
            onKeyDown={ this.handleTableScroll }
            tabIndex="-1"
          >
            <Icon name="angle left" data-tablearrow="left" />
          </span>
          <span
            role="button"
            data-tablearrow="right"
            onClick={ this.handleTableScroll }
            onKeyDown={ this.handleTableScroll }
            tabIndex="-1"
          >
            <Icon name="angle right" data-tablearrow="right" />
          </span>
          <div className={ displayTableMenu ? 'items_menu_list display' : 'items_menu_list' }>
            { columnMenu.map( item => (
              <Checkbox
                data-tablemenuitem
                data-propname={ item.name }
                data-proplabel={ item.label }
                label={ titleCase( item.label ) }
                key={ item.name }
                onChange={ tableMenuOnChange }
                onClick={ this.toggleCheckbox }
                checked={ menuHeaders.includes( item.label ) }
              />
            ) ) }
          </div>
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
