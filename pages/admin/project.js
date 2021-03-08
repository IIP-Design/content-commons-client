import React from 'react';
import PropTypes from 'prop-types';
import { redirectTo } from 'lib/browser';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import trim from 'lodash/trim';
import isEmpty from 'lodash/isEmpty';
import { GRAPHIC_PROJECT_QUERY } from 'lib/graphql/queries/graphic';
import { VIDEO_PROJECT_QUERY } from 'lib/graphql/queries/video';

// using dynamic import so that components load when they are needed, or rendered
const GraphicEdit = dynamic( () => import( /* webpackChunkName: "graphicEdit" */ 'components/admin/ProjectEdit/GraphicEdit/GraphicEdit' ) );
const VideoEdit = dynamic( () => import( /* webpackChunkName: "videoEdit" */ 'components/admin/ProjectEdit/VideoEdit/VideoEdit' ) );
const VideoReview = dynamic( () => import( /* webpackChunkName: "videoReview" */ 'components/admin/ProjectReview/VideoReview/VideoReview' ) );

const CONTENT_TYPES = ['graphic', 'video'];

const allowedContentTypes = content => content && CONTENT_TYPES.includes( trim( content ) );

/**
 * Returns query applicable to content type
 * @param {String} content content type, i.e. video, image, etc
 */
const getProjectQuery = content => {
  switch ( content ) {
    case 'graphic':
      return GRAPHIC_PROJECT_QUERY;

    case 'video':
      return VIDEO_PROJECT_QUERY;

    default:
      return null;
  }
};

const ProjectPage = ( { query, router } ) => {
  // Handles client side route checking
  const isValidPath = q => q && allowedContentTypes( q.content );

  const loadEditComponent = () => {
    switch ( query.content ) {
      case 'video':
        return <VideoEdit id={ query.id } />;

      case 'graphic':
        return <GraphicEdit id={ query.id } />;

      default:
        return null;
    }
  };

  const loadReviewComponent = () => {
    if ( query.content === 'video' ) {
      return <VideoReview id={ query.id } />;
    }

    return null;
  };

  if ( !isValidPath( query ) ) {
    router.push( '/admin/dashboard' );
  }

  const { action: actionQry } = query;

  if ( actionQry === 'edit' ) {
    return loadEditComponent();
  }

  if ( actionQry === 'review' ) {
    return loadReviewComponent();
  }

  return null;
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
      variables: { id: query.id },
    } )
    .catch( err => console.dir( err ) );

  return {};
};

ProjectPage.propTypes = {
  query: PropTypes.object,
  router: PropTypes.object,
};

export default withRouter( ProjectPage );
