import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import trim from 'lodash/trim';

// using dynamic import so that components load when they are needed, or rendered
const VideoEdit = dynamic( () => import( 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit' ) );
const VideoReview = dynamic( () => import( 'components/admin/projects/ProjectReview/VideoReview' ) );

const CONTENT_TYPES = ['video'];

const ProjectPage = props => {
  const { query: { id, content, action }, router } = props;

  const loadEditComponent = () => {
    if ( content === 'video' ) {
      return <VideoEdit id={ id } />;
    }
  };

  const loadReviewComponent = () => {
    if ( content === 'video' ) {
      return <VideoReview id={ id } />;
    }
  };

  const redirectToDashboard = () => {
    router.push( '/admin/dashboard' );
  };

  /**
   * Verify that a content type uery param are present,
   * if not send to dashboard
   * @param {object} query { content, action }
   */
  const isPathValid = query => {
    if ( !query
      || !content
      || !CONTENT_TYPES.includes( trim( content ) ) ) {
      return false;
    }

    return true;
  };

  if ( !isPathValid( props.query ) ) {
    redirectToDashboard();
  }

  if ( action === 'edit' ) {
    return loadEditComponent();
  }

  return loadReviewComponent();
};


ProjectPage.propTypes = {
  query: PropTypes.object
};


export default withRouter( ProjectPage );
