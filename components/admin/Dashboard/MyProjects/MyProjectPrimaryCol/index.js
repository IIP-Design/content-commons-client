/**
 *
 * MyProjectPrimaryCol
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import truncate from 'lodash/truncate';
import {
  Checkbox, Icon, Popup, Modal
} from 'semantic-ui-react';
import { isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import SupportFiles from './SupportFiles';
import PreviewProjectItem from '../PreviewProjectItem';
import './MyProjectPrimaryCol.scss';

class MyProjectPrimaryCol extends React.Component {
  state = {
    detailsPopupOpen: false
  };

  componentDidMount() {
    this.setState( { windowWidth: isWindowWidthLessThanOrEqualTo( 400 ) } );
  }

  componentWillUnmount() {
    // Handles React subscription error 'cannot setState on unmounted component'
    // Error occurs when details popup open & navigate away from page
    // resize listener will not be removed
    window.removeEventListener( 'resize', this.detailsPopupOnResizeOrScroll );
  }

  handleDataActionsOffClick = e => {
    // Check if click target is a data actions menu link
    const isDataActionsMenuLink = e.target.classList.contains( 'myProjects_data_actions_action' );
    if ( isDataActionsMenuLink ) return;

    // If click target is not actions menu toggle button
    if ( !e.target.classList.contains( 'ellipsis' ) ) {
      // Close any open menus
      const openDataActionsMenu = document.querySelector( '.displayDataActions' );
      if ( openDataActionsMenu !== null ) openDataActionsMenu.classList.remove( 'displayDataActions' );

      // Remove the document click event handler since no open menus
      document.removeEventListener( 'click', this.handleDataActionsOffClick );
    }
  }

  toggleDataActions = e => {
    e.persist();

    // Select target table td element
    const parentTD = e.target.closest( '.items_table_item' );

    if ( parentTD.classList.contains( 'displayDataActions' ) ) {
      parentTD.classList.remove( 'displayDataActions' );
    } else {
      // Close any other open dataActions menus
      const openDataActionsMenu = document.querySelector( '.displayDataActions' );
      if ( openDataActionsMenu !== null ) openDataActionsMenu.classList.remove( 'displayDataActions' );

      // Display target dataActions menu
      parentTD.classList.add( 'displayDataActions' );

      // Add a document click event listener to close any open data actions menus on 'off' clicks
      document.addEventListener( 'click', this.handleDataActionsOffClick );
    }
  }

  detailsPopupOnResizeOrScroll = () => this.setState( { detailsPopupOpen: false } );

  handleDetailsPopupOpen = () => {
    this.setState( { detailsPopupOpen: true } );
    window.addEventListener( 'resize', this.detailsPopupOnResizeOrScroll );

    const itemsTable = document.querySelector( '.items_table' );
    itemsTable.addEventListener( 'scroll', this.detailsPopupOnResizeOrScroll );
  }

  handleDetailsPopupClose = () => {
    this.setState( { detailsPopupOpen: false } );
    window.removeEventListener( 'resize', this.detailsPopupOnResizeOrScroll );

    const itemsTable = document.querySelector( '.items_table' );
    itemsTable.removeEventListener( 'scroll', this.detailsPopupOnResizeOrScroll );
  }

  render() {
    const { detailsPopupOpen, windowWidth } = this.state;
    const {
      d,
      d: { id },
      header,
      selectedItems,
      toggleItemSelection
    } = this.props;

    return (
      <Fragment>
        <div className="myProjects_actions">
          <Checkbox
            data-label={ id }
            checked={ !!selectedItems.get( `${id}` ) }
            onChange={ toggleItemSelection }
          />
          { /* <div className="myProjects_favorite"><Icon name='star' /></div> */ }
        </div>
        <div className="myProjects_thumbnail">
          <img src={ d.thumbnail.url } alt={ d.thumbnail.alt } />
        </div>
        <div className="myProjects_data">
          <Link href={ `/admin/project/video/${id}/review` }>
            <a
              className="myProjects_data_title"
              title={ d[header.name] }
            >
              { truncate( d[header.name], { length: 35 } ) }
              <span className="myProjects_data_title--accessibility">{ d[header.name] }</span>
            </a>
          </Link>
          <div className="myProjects_data_actions">
            <div className="myProjects_data_actions_wrapper">
              <Popup
                className="detailsFiles_popup"
                trigger={ <button type="button" className="linkStyle myProjects_data_actions_action">Details</button> }
                content={ <SupportFiles id={ id } /> }
                on="click"
                position={ windowWidth <= 400 ? 'bottom right' : 'bottom center' }
                hideOnScroll
                keepInViewPort={ false }
                open={ detailsPopupOpen }
                onOpen={ this.handleDetailsPopupOpen }
                onClose={ this.handleDetailsPopupClose }
              />
              <span> | </span>
              <Modal
                trigger={ <button type="button" className="linkStyle myProjects_data_actions_action">Preview</button> }
                closeIcon
              >
                <Modal.Content>
                  <PreviewProjectItem id={ id } />
                </Modal.Content>
              </Modal>
              <span> | </span>
              <button type="button" className="linkStyle myProjects_data_actions_action">Share</button>
            </div>
            <button
              type="button"
              className="linkStyle myProjects_data_actions_mobileToggle"
              onClick={ this.toggleDataActions }
            >
              <Icon name="ellipsis vertical" />
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

MyProjectPrimaryCol.propTypes = {
  d: PropTypes.object,
  header: PropTypes.object,
  selectedItems: PropTypes.instanceOf( Map ),
  toggleItemSelection: PropTypes.func
};

export default MyProjectPrimaryCol;
