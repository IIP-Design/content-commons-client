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

  componentDidMount() {
    this.menuHeadersOnMobile();
    window.addEventListener( 'resize', this.menuHeadersOnResize );
  }

  componentWillUnmount() {
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
                aria-expanded={ displayTableMenu }
                as="button"
                active={ !displayTableMenu }
                data-tablemenu
                onClick={ this.toggleTableMenu }
                onFocus={ this.toggleTableMenu }
              >
                Show More <VisuallyHidden el="span">columns</VisuallyHidden>
                <Icon name={ `angle ${displayTableMenu ? 'up' : 'down'}` } />
              </Accordion.Title>
              <Accordion.Content
                as="ul"
                active={ displayTableMenu }
                hidden={ !displayTableMenu }
              >
                { columnMenu.map( item => (
                  <li key={ item.name }>
                    <Checkbox
                      data-tablemenuitem
                      data-propname={ item.name }
                      data-proplabel={ item.label }
                      id={ item.label }
                      label={ titleCase( item.label ) }
                      onChange={ tableMenuOnChange }
                      onClick={ this.toggleCheckbox }
                      checked={ menuHeaders.includes( item.label ) }
                    />
                  </li>
                ) ) }
              </Accordion.Content>
            </Menu.Item>
          </Accordion>

          <span
            role="button"
            data-tablearrow="left"
            onClick={ this.handleTableScroll }
            onKeyDown={ this.handleTableScroll }
            tabIndex="0"
          >
            <Icon name="angle left" data-tablearrow="left" />
          </span>
          <span
            role="button"
            data-tablearrow="right"
            onClick={ this.handleTableScroll }
            onKeyDown={ this.handleTableScroll }
            tabIndex="0"
          >
            <Icon name="angle right" data-tablearrow="right" />
          </span>
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
