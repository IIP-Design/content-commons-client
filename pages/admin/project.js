import React from 'react';
import PropTypes from 'prop-types';
import { redirectTo } from 'lib/browser';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import trim from 'lodash/trim';
import isEmpty from 'lodash/isEmpty';
import { VIDEO_PROJECT_QUERY } from 'lib/graphql/queries/video';
import { ProjectProvider } from 'components/admin/context/ProjectContext';

// using dynamic import so that components load when they are needed, or rendered
const VideoEdit = dynamic( () => import( 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit' ) );
const VideoReview = dynamic( () => import( 'components/admin/projects/ProjectReview/VideoReview' ) );

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
      return (
        <VideoEdit id={ props.query.id } />
      );
    }
  };

  const loadReviewComponent = () => {
    if ( props.query.content === 'video' ) {
      return <VideoReview id={ props.query.id } />;
    }
  };


  const getProject = () => {
    switch ( props.query.content ) {
      case 'video':
        return props.videoProject || {};

      default:
        return {};
    }
  };


  if ( !isValidPath( props.query ) ) {
    props.router.push( '/admin/dashboard' );
  }

  const { action: actionQry } = props.query;

  const initialState = getProject();

  const reducer = ( state, action ) => {
    switch ( action.type ) {
      case 'updateProject':
        return {
          ...state
        };

      default:
        return state;
    }
  };

  return (
    <ProjectProvider initialState={ initialState } reducer={ reducer }>
      { actionQry === 'edit'
        ? loadEditComponent()
        : loadReviewComponent()
      }
    </ProjectProvider>
  );
};


ProjectPage.getInitialProps = async ( { query, res, apolloClient } ) => {
  // Send to dahsboard if the query is not present or the content type is not valid
  // Handles server side route checking
  if ( isEmpty( query ) || !allowedContentTypes( query.content ) ) {
    redirectTo( '/admin/dashboard', { res } );
  }

  // If there is no id return empty project data object
  if ( !query.id ) {
    return {};
  }

  // Fetch applicable query and populate project data for use in child components
  const { data } = await apolloClient.query( {
    query: getProjectQuery( query.content ),
    variables: { id: query.id }
  } );

  return data;
};


ProjectPage.propTypes = {
  query: PropTypes.object,
  router: PropTypes.object,
  videoProject: PropTypes.object
};


export default withRouter( ProjectPage );
