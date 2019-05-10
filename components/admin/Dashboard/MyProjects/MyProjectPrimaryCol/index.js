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
  Checkbox, Icon, Modal
} from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import DetailsPopup from '../DetailsPopup/DetailsPopup';
import ShareProjectItem from '../ShareProjectItem/ShareProjectItem';
import PreviewProjectItem from '../PreviewProjectItem';
import './MyProjectPrimaryCol.scss';

const handleDataActionsOffClick = e => {
  // Check if click target is a data actions menu link
  const isDataActionsMenuLink = e.target.classList.contains( 'myProjects_data_actions_action' );
  if ( isDataActionsMenuLink ) return;

  // If click target is not actions menu toggle button
  if ( !e.target.classList.contains( 'ellipsis' ) ) {
    // Close any open menus
    const openDataActionsMenu = document.querySelector( '.displayDataActions' );
    if ( openDataActionsMenu !== null ) openDataActionsMenu.classList.remove( 'displayDataActions' );

    // Remove the document click event handler since no open menus
    document.removeEventListener( 'click', handleDataActionsOffClick );
  }
};

const toggleDataActions = e => {
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
    document.addEventListener( 'click', handleDataActionsOffClick );
  }
};

const MyProjectPrimaryCol = props => {
  const {
    d,
    d: { id },
    header,
    selectedItems,
    toggleItemSelection,
    windowWidth
  } = props;

  const projectTitleLength = d[header.name].length >= 35;
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
            <span aria-hidden={ projectTitleLength }>{ truncate( d[header.name], { length: 35 } ) }</span>
            { projectTitleLength && <VisuallyHidden>{ d[header.name] }</VisuallyHidden> }
          </a>
        </Link>
        <div className="myProjects_data_actions">
          <div className="myProjects_data_actions_wrapper">
            <DetailsPopup id={ id } windowWidth={ windowWidth } />
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
            <ShareProjectItem id={ id } windowWidth={ windowWidth } />
          </div>
          <button
            type="button"
            className="linkStyle myProjects_data_actions_mobileToggle"
            onClick={ toggleDataActions }
          >
            <Icon name="ellipsis vertical" />
          </button>
        </div>
      </div>
    </Fragment>
  );
};

MyProjectPrimaryCol.propTypes = {
  d: PropTypes.object,
  header: PropTypes.object,
  selectedItems: PropTypes.instanceOf( Map ),
  toggleItemSelection: PropTypes.func,
  windowWidth: PropTypes.number
};

export default MyProjectPrimaryCol;
