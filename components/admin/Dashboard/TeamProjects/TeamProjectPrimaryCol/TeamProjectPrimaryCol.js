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
  Checkbox, Icon, Modal, Popup
} from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import PreviewProjectContent from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
// import DataAction from 'components/admin/Dashboard/DataAction/DataAction';
import DetailsPopup from '../DetailsPopup/DetailsPopup';
import './TeamProjectPrimaryCol.scss';

const handleDataActionsOffClick = e => {
  // Check if click target is a data actions menu link
  const isDataActionsMenuLink = e.target.classList.contains( 'projects_data_actions_action' );
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

const TeamProjectPrimaryCol = props => {
  const {
    d,
    d: { id },
    header,
    selectedItems,
    toggleItemSelection
  } = props;

  const isDraft = d.status === 'DRAFT';
  const isPublishing = d.status === 'PUBLISHING';
  const actions = ['Edit', 'Preview', 'Files'];
  const projectTitleLength = d[header.name].length >= 35;
  return (
    <Fragment>
      <div className="projects_actions">
        <Checkbox
          data-label={ id }
          checked={ !!selectedItems.get( `${id}` ) }
          onChange={ toggleItemSelection }
          disabled={ isPublishing }
        />
      </div>
      <div className="projects_thumbnail">
        <div className="wrapper">
          { d.thumbnail.url
            ? (
              <img
                className={ isDraft ? 'draft' : null }
                src={ d.thumbnail.url }
                alt={ d.thumbnail.alt }
              />
            )
            : (
              <div className="placeholder outer">
                <div className="placeholder inner" />
              </div>
            )
          }

          { isDraft && (
            <p className="draft-overlay">
              <span>{ d.status }</span>
            </p>
          ) }
        </div>
      </div>
      <div className="projects_data">
        { /**
           * Display tooltip for keyboard accessibility.
           * Tradeoff? Can't use <Link> in trigger and no
           * page transition animation, but err on side
           * of better accessibility.
           */ }
        { projectTitleLength
          ? (
            <Popup
              trigger={ (
                <a
                  href={ `/admin/project/video/${id}/edit` }
                  className="projects_data_title"
                >
                  <span aria-hidden>{ truncate( d[header.name], { length: 35 } ) }</span>
                  <VisuallyHidden el="span">{ d[header.name] }</VisuallyHidden>
                </a>
              ) }
              content={ d[header.name] }
              hideOnScroll
              inverted
              on={ ['hover', 'focus'] }
              size="mini"
            />
          )
          : (
            <Link as={ `/admin/project/video/${id}/edit` } href={ `/admin/project?content=video&id=${id}&action=edit` }>
              <a className="projects_data_title">
                { d[header.name] }
              </a>
            </Link>
          ) }
        <div className="projects_data_actions">
          <div className="projects_data_actions_wrapper">
            { isPublishing
              ? actions.map( action => (
                <span key={ `${action}-${id}` } className="linkStyle projects_data_actions_action isPublishing">
                  { action }
                </span>
              ) )
              : (
                <Fragment>
                  <Link as={ `/admin/project/video/${id}/edit` } href={ `/admin/project?content=video&id=${id}&action=edit` }>
                    <a className="linkStyle projects_data_actions_action">Edit</a>
                  </Link>

                  <Modal
                    trigger={ <button type="button" className="linkStyle projects_data_actions_action">Preview</button> }
                    closeIcon
                  >
                    <Modal.Content>
                      <PreviewProjectContent id={ id } />
                    </Modal.Content>
                  </Modal>

                  <DetailsPopup id={ id } />
                </Fragment>
              ) }
          </div>
          <button
            type="button"
            className="linkStyle projects_data_actions_mobileToggle"
            onClick={ toggleDataActions }
          >
            <Icon name="ellipsis vertical" />
          </button>
        </div>
      </div>
    </Fragment>
  );
};

TeamProjectPrimaryCol.propTypes = {
  d: PropTypes.object,
  header: PropTypes.object,
  selectedItems: PropTypes.instanceOf( Map ),
  toggleItemSelection: PropTypes.func
};

export default TeamProjectPrimaryCol;
