import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import trim from 'lodash/trim';
import { VIDEO_PROJECT_QUERY } from 'lib/graphql/queries/VideoProject';

// using dynamic import so that components load when they are needed, or rendered
const VideoEdit = dynamic( () => import( 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit' ) );
const VideoReview = dynamic( () => import( 'components/admin/projects/ProjectReview/VideoReview' ) );

export const ProjectContext = React.createContext();

const CONTENT_TYPES = ['video'];

/**
 * Verify that valid query params are present,
 * to execute a project query
 * @param {object} query { content, action }
 */
const isQueryValid = query => {
  if ( !query
    || !query.id
    || !query.content
    || !CONTENT_TYPES.includes( trim( query.content ) ) ) {
    return false;
  }

  return true;
};


const ProjectPage = props => {
  const { query: { id, content, action }, router } = props;

  const loadEditComponent = () => {
    if ( content === 'video' ) {
      return (
        <VideoEdit id={ id } />
      );
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


  const getProjectData = () => {
    const { videoProject } = props;

    switch ( content ) {
      case 'video':
        return videoProject || {};

      default:
        return {};
    }
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

  return (
    <ProjectContext.Provider value={ getProjectData( props ) }>
      { action === 'edit'
        ? loadEditComponent()
        : loadReviewComponent()
      }
    </ProjectContext.Provider>
  );
};


ProjectPage.getInitialProps = async props => {
  if ( !isQueryValid( props.query ) ) {
    return {};
  }

  // This will check for other content type queries go forward
  const query = VIDEO_PROJECT_QUERY;

  const { data } = await props.apolloClient.query( {
    query,
    variables: { id: props.query.id }
  } );

  return data;
};


ProjectPage.propTypes = {
  query: PropTypes.object,
  router: PropTypes.object,
  videoProject: PropTypes.object
};


export default withRouter( ProjectPage );
