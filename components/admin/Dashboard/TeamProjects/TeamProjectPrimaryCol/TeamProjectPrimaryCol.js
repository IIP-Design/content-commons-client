/**
 *
 * TeamProjectPrimaryCol
 *
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import truncate from 'lodash/truncate';
import {
  Checkbox, Icon, Modal, Popup
} from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import DetailsPopup from '../DetailsPopup/DetailsPopup';
import './TeamProjectPrimaryCol.scss';

const PackagePreview = dynamic(
  () => import(
    /* webpackChunkName: "packagePreview" */
    'components/admin/PackagePreview/PackagePreview'
  )
);

const ProjectPreviewContent = dynamic(
  () => import(
    /* webpackChunkName: "projectPreviewContent" */
    'components/admin/ProjectPreview/ProjectPreviewContent/ProjectPreviewContent'
  )
);

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
    toggleItemSelection,
    team
  } = props;

  const isDraft = d.status === 'DRAFT';
  const isPublishing = d.status === 'PUBLISHING';
  const actions = ['Edit', 'Preview', 'Files'];
  const Trigger = isPublishing ? 'span' : 'a';
  const Title = isPublishing ? 'span' : Link;
  const projectTitleLength = d[header.name].length >= 35;

  const getEditUrl = ( format = '' ) => {
    if ( isPublishing || !format ) return null;

    // TEMP Package || DocumentFile url
    if ( d.__typename === 'Package' ) return `/admin/package/${id}`;
    if ( d.__typename === 'DocumentFile' ) return `/admin/document/${id}`;

    if ( format === 'pretty' ) {
      return `/admin/project/video/${id}/edit`;
    }
    if ( format === 'long' ) {
      return `/admin/project?content=video&id=${id}&action=edit`;
    }
  };

  const getTitleCls = () => (
    `projects_data_title${isPublishing ? ' isPublishing' : ''}`
  );

  const getActionCls = () => (
    `linkStyle projects_data_actions_action${isPublishing ? ' isPublishing' : ''}`
  );

  const getPkgModalSize = screenSize => (
    // screenSize: Semantic UI modal size prop value
    d.__typename === 'Package' ? { size: screenSize } : {}
  );

  const getContentPreviewComponent = () => {
    switch ( d.__typename ) {
      case 'Package':
        return PackagePreview;
      // case 'SomeFutureType':
      //   return FutureTypePreview;
      case 'VideoProject':
      default:
        return ProjectPreviewContent;
    }
  };

  const ContentPreview = getContentPreviewComponent();

  return (
    <Fragment>
      <div className="projects_actions">
        <Checkbox
          { ...( isPublishing ? {} : { 'data-label': id } ) }
          checked={ !!selectedItems.get( `${id}` ) }
          onChange={ toggleItemSelection }
          disabled={ isPublishing }
        />
      </div>
      <div className="projects_thumbnail">
        <div className="wrapper">
          { d.thumbnail && d.thumbnail.signedUrl
            ? (
              <img
                className={ isDraft ? 'draft' : null }
                src={ d.thumbnail.signedUrl }
                alt={ d.thumbnail.alt }
              />
            )
            : (
              <div className="placeholder outer">
                <div className="placeholder inner" />
              </div>
            ) }
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
                <Trigger
                  href={ getEditUrl( 'pretty' ) }
                  className={ getTitleCls() }
                >
                  <span aria-hidden>
                    { truncate( d[header.name], { length: 35 } ) }
                  </span>
                  <VisuallyHidden el="span">
                    { d[header.name] }
                  </VisuallyHidden>
                </Trigger>
              ) }
              content={ d[header.name] }
              hideOnScroll
              inverted
              on={ ['hover', 'focus'] }
              size="mini"
            />
          )
          : (
            <Title
              as={ getEditUrl( 'pretty' ) }
              href={ getEditUrl( 'long' ) }
              prefetch={ false }
            >
              <Trigger className={ getTitleCls() }>
                { d[header.name] }
              </Trigger>
            </Title>
          ) }
        <div className="projects_data_actions">
          <div className="projects_data_actions_wrapper">
            { isPublishing
              ? actions.map( ( action, i ) => (
                <Fragment key={ `${action}-${id}` }>
                  <span className={ getActionCls() }>
                    { action }
                  </span>
                  { ( i < actions.length - 1 )
                    && <span className="separator">|</span> }
                </Fragment>
              ) )
              : (
                <Fragment>
                  <Link
                    as={ getEditUrl( 'pretty' ) }
                    href={ getEditUrl( 'long' ) }
                    prefetch={ false }
                  >
                    <a className={ getActionCls() }>Edit</a>
                  </Link>
                  <span className="separator">|</span>
                  <Modal
                    trigger={ (
                      <button type="button" className={ getActionCls() }>
                        Preview
                      </button>
                    ) }
                    closeIcon
                    className={ `${d.__typename}-preview` }
                    { ...getPkgModalSize( 'fullscreen' ) }
                  >
                    <Modal.Content>
                      <ContentPreview id={ id } />
                    </Modal.Content>
                  </Modal>
                  { d.__typename !== 'DocumentFile' && (
                    <Fragment>
                      <span className="separator">|</span>
                      <DetailsPopup id={ id } team={ team } />
                    </Fragment>
                  ) }
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
  toggleItemSelection: PropTypes.func,
  team: PropTypes.object,
};

export default TeamProjectPrimaryCol;
