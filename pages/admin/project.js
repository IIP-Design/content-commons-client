import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import trim from 'lodash/trim';

// @todo import mock data for now, remove after GraphQL & Apollo
import { projects } from 'components/admin/projects/ProjectEdit/mockData';

// using dynamic import so that components load when they are needed, or rendered
const VideoEdit = dynamic( () => import( 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit' ) );
const VideoReview = dynamic( () => import( 'components/admin/projects/ProjectReview/VideoReview' ) );

const CONTENT_TYPES = ['video'];

const loadEditComponent = ( content, id ) => {
  if ( content === 'video' ) {
    // @todo use project prop for now, remove after GraphQL & Apollo
    return <VideoEdit id={ id } project={ projects[0] } />;
  }
};

const loadReviewComponent = ( content, id ) => {
  if ( content === 'video' ) {
    return <VideoReview id={ id } />;
  }
};

/**
 * Verify that a content type and project id query params are present,
 * if not send to dashboard
 * @param {object} query { content, id, action }
 */
const isPathValid = query => {
  if ( !query
    || !query.content
    || !query.id
    || !CONTENT_TYPES.includes( trim( query.content ) ) ) {
    return false;
  }

  return true;
};

const ProjectPage = props => {
  if ( !isPathValid( props.query ) ) {
    props.router.push( '/admin/dashboard' );
  }

  const { id, content, action } = props.query;

  if ( action === 'edit' ) {
    return loadEditComponent( content, id );
  }

  return loadReviewComponent( content, id );
};


ProjectPage.propTypes = {
  query: PropTypes.object
};


export default withRouter( ProjectPage );
