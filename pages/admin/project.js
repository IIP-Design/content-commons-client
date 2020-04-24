import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { redirectTo } from 'lib/browser';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import trim from 'lodash/trim';
import isEmpty from 'lodash/isEmpty';
import { VIDEO_PROJECT_QUERY } from 'lib/graphql/queries/video';

// using dynamic import so that components load when they are needed, or rendered
const VideoEdit = dynamic( () => import( /* webpackChunkName: "videoEdit" */ 'components/admin/ProjectEdit/VideoEdit/VideoEdit' ) );
const VideoReview = dynamic( () => import( /* webpackChunkName: "videoReview" */ 'components/admin/ProjectReview/VideoReview/VideoReview' ) );

const CONTENT_TYPES = ['video'];

const allowedContentTypes = content => content && CONTENT_TYPES.includes( trim( content ) );

/**
 * Returns query applicable to content type
 * @param {String} content content type, i.e. video, image, etc
 */
const getProjectQuery = content => {
  switch ( content ) {
    case 'video':
      return VIDEO_PROJECT_QUERY;

    default:
      return null;
  }
};

const ProjectPage = props => {
  // Handles client side route checking
  const isValidPath = query => query && allowedContentTypes( query.content );

  const loadEditComponent = () => {
    if ( props.query.content === 'video' ) {
      return <VideoEdit id={ props.query.id } />;
    }
  };

  const loadReviewComponent = () => {
    if ( props.query.content === 'video' ) {
      return <VideoReview id={ props.query.id } />;
    }
  };

  if ( !isValidPath( props.query ) ) {
    props.router.push( '/admin/dashboard' );
  }

  const { action: actionQry } = props.query;

  return (
    <Fragment>
      { actionQry === 'edit' ? loadEditComponent() : loadReviewComponent() }
    </Fragment>
  );
};

// Executes before page renders
ProjectPage.getInitialProps = async ( { query, res, apolloClient } ) => {
  // Send to dashboard if the query is not present or the content type is not valid
  // Handles server side route checking
  if ( isEmpty( query ) || !allowedContentTypes( query.content ) ) {
    redirectTo( '/admin/dashboard', { res } );
  }

  // If there is no id return empty project data object
  if ( !query.id ) {
    return {};
  }

  // Fetch applicable query and populate project data for use in child components
  await apolloClient
    .query( {
      query: getProjectQuery( query.content ),
      variables: { id: query.id }
    } )
    .catch( err => console.dir( err ) );

  return {};
};

ProjectPage.propTypes = {
  query: PropTypes.object,
  router: PropTypes.object
};

export default withRouter( ProjectPage );
