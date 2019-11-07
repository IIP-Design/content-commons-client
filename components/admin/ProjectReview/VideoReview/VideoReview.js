import React, { Fragment, useState, useEffect } from 'react';
import { func, object, string } from 'prop-types';
import Router from 'next/router';
import { compose, graphql, withApollo } from 'react-apollo';
import {
  Button, Confirm, Grid, Icon, Loader
} from 'semantic-ui-react';

import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import VideoProjectData from 'components/admin/ProjectReview/VideoProjectData/VideoProjectData';
import VideoSupportFiles from 'components/admin/ProjectReview/VideoSupportFiles/VideoSupportFiles';
import VideoProjectFiles from 'components/admin/ProjectReview/VideoProjectFiles/VideoProjectFiles';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import ProjectPreview from 'components/admin/ProjectPreview/ProjectPreview';
import PreviewProjectContent from 'components/admin/ProjectEdit/ProjectPreviewContent/ProjectPreviewContent';
import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';
import ApolloError from 'components/errors/ApolloError';

import {
  UPDATED_PROJECTS_CACHE_QUERY,
  REMOVE_UPDATED_PROJECTS_CACHE_MUTATION
} from 'lib/graphql/queries/client';
import {
  PUBLISH_VIDEO_PROJECT_MUTATION,
  UNPUBLISH_VIDEO_PROJECT_MUTATION,
  DELETE_VIDEO_PROJECT_MUTATION,
  VIDEO_PROJECT_QUERY
} from 'lib/graphql/queries/video';
import { PROJECT_STATUS_CHANGE_SUBSCRIPTION } from 'lib/graphql/queries/common';
// import { findAllValuesForKey } from 'lib/utils';

import './VideoReview.scss';

const VideoReview = props => {
  const {
    client, id, data, data: { error, loading }, statusChange
  } = props;

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [publishError, setPublishError] = useState( null );
  const [publishing, setPublishing] = useState( false );

  // Check if project has been updated, project id will be in Apollo Client Cache
  const [isProjectInCache, setIsProjectInCache] = useState( false );
  useEffect( () => {
    const { updatedProjects } = client.readQuery( { query: UPDATED_PROJECTS_CACHE_QUERY } );
    if ( updatedProjects.includes( id ) ) {
      setIsProjectInCache( true );
    }
  }, [isProjectInCache] );

  if ( loading ) {
    return (
      <div style={ {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading the project..."
        />
      </div>
    );
  }

  if ( error ) {
    return (
      <div className="video-review-project error">
        <p>
          <Icon color="red" name="exclamation triangle" />
          <span>Loading error...</span>
        </p>
      </div>
    );
  }

  if ( !data.project ) return <ProjectNotFound />;

  if ( publishing ) {
    if ( statusChange && statusChange.projectStatusChange && statusChange.projectStatusChange.error ) {
      setPublishError( { otherError: statusChange.projectStatusChange.error } );
      setPublishing( false );
    }
  }

  const displayConfirmDelete = () => setDeleteConfirmOpen( true );
  const handleDeleteCancel = () => setDeleteConfirmOpen( false );

  const setButtonState = btn => `project_button project_button--${btn} ${publishing ? 'loading' : ''}`;

  // const updatesToPublish = () => {
  //   const { project } = data;
  //   if ( project ) {
  //     // updatedAt at the project level does not account for nested updates
  //     // so we need to find all updatedAt props to locate most recent update
  //     const allUpdates = findAllValuesForKey( project, 'updatedAt' );
  //     const mostRecentUpdate = allUpdates.reduce( ( max, p ) => ( p > max ? p : max ), allUpdates[0] );
  //     const { status, publishedAt } = project;

  //     if ( status === 'PUBLISHED' ) {
  //       const lastUpdate = new Date( mostRecentUpdate ).getTime();
  //       const publishDate = new Date( publishedAt ).getTime();

  //       // At publish time, updatedAt and pubishedAt are approximately equal so
  //       // we add 10 seconds so that Update does not show right after a publish
  //       if ( publishedAt && ( lastUpdate > ( publishDate + 10000 ) ) ) { return true; }
  //     }
  //   }

  //   return false;
  // };

  const handleDeleteProject = () => {
    const { deleteProject } = props;
    deleteProject( { variables: { id } } );
    Router.push( { pathname: '/admin/dashboard' } );
  };

  const handleEdit = () => {
    Router.push( {
      pathname: '/admin/project',
      query: {
        id,
        content: 'video',
        action: 'edit'
      }
    }, `/admin/project/video/${id}/edit` );
  };

  const handlePublish = async e => {
    // Prevent multiple clicks - multiple clicks resulted in project going into PUBLISHING status
    if ( !e.detail || e.detail === 1 ) e.target.disabled = true;

    const { publishProject, removeUpdatedProjectFromCache } = props;

    try {
      setPublishing( true );
      console.log( 'Publishing to queue...' );
      await publishProject( { variables: { id } } );

      // UPDATE APOLLO CLIENT CACHE
      // Apollo Client cache mutation does not re-render component, setting component state to trigger render
      removeUpdatedProjectFromCache( {
        variables: { id },
        update: () => setIsProjectInCache( false )
      } );
    } catch ( err ) {
      setPublishing( false );
      setPublishError( err );
    }
  };

  const handleUnPublish = async e => {
    // Prevent multiple clicks - multiple clicks resulted in project going into PUBLISHING status
    if ( !e.detail || e.detail === 1 ) e.target.disabled = true;

    const { unPublishProject, removeUpdatedProjectFromCache } = props;

    try {
      setPublishing( true );
      await unPublishProject( { variables: { id } } );

      // APOLLO CLIENT CACHE
      // Apollo Client cache mutation does not re-render component, setting component state to trigger render
      removeUpdatedProjectFromCache( {
        variables: { id },
        update: () => setIsProjectInCache( false )
      } );
    } catch ( err ) {
      setPublishing( false );
      setPublishError( err );
    }
  };

  // Project Status & Update States
  const publishedAndUpdated = isProjectInCache && data.project.status === 'PUBLISHED';
  const publishedAndNotUpdated = !isProjectInCache && data.project.status === 'PUBLISHED';
  const notPublished = data.project.status !== 'PUBLISHED';

  return (
    <div className="review-project">

      <ProjectHeader icon="video camera" text="Project Details - Review">
        { data.project.status === 'DRAFT' && (
        <Button
          content="Delete Project"
          className="project_button project_button--delete"
          onClick={ displayConfirmDelete }
        />
        )
        }

        <Confirm
          className="delete"
          open={ deleteConfirmOpen }
          content={ (
            <ConfirmModalContent
              className="delete_confirm delete_confirm--video"
              headline="Are you sure you want to delete this video project?"
            >
              <p>This video project will be permanently removed from the Content Cloud. Any videos that you uploaded here will not be uploaded.</p>
            </ConfirmModalContent>
          ) }
          onCancel={ handleDeleteCancel }
          onConfirm={ handleDeleteProject }
          cancelButton="No, take me back"
          confirmButton="Yes, delete forever"
        />

        <Button
          className="project_button project_button--edit"
          content="Edit"
          onClick={ handleEdit }
        />

        <ProjectPreview
          triggerProps={ {
            className: 'project_button project_button--preview',
            content: 'Preview Project'
          } }
          contentProps={ { id } }
          modalTrigger={ Button }
          modalContent={ PreviewProjectContent }
          options={ { closeIcon: true } }
        />

        { data.project.status === 'DRAFT'
          ? <Button className={ setButtonState( 'publish' ) } onClick={ handlePublish }>Publish</Button>
          : (
            <Fragment>
              { publishedAndUpdated && (
                <Button className={ setButtonState( 'edit' ) } onClick={ handlePublish }>Publish Changes</Button>
              )
              }
              <Button className="project_button project_button--publish" onClick={ handleUnPublish }>Unpublish</Button>
            </Fragment>
          )
        }
      </ProjectHeader>

      <div className="centered">
        <ApolloError error={ publishError } />
      </div>

      <Grid stackable>
        <Grid.Row className="layout">
          <Grid.Column mobile={ 16 } computer={ 8 }>
            <VideoProjectData id={ id } />
          </Grid.Column>

          <Grid.Column mobile={ 16 } computer={ 8 }>
            <VideoSupportFiles id={ id } />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <VideoProjectFiles id={ id } />

      <section className="section section--publish">
        <h3 className="title">
          { publishedAndUpdated && 'It looks like you made changes to your project. Do you want to publish changes?' }
          { notPublished && 'Your project looks great! Are you ready to Publish?' }
          { publishedAndNotUpdated && 'Not ready to share with the world yet?' }
        </h3>
        <Button
          className="project_button project_button--edit"
          content="Edit"
          onClick={ handleEdit }
        />
        { !publishedAndNotUpdated && (
          <Button
            className={ `project_button project_button--${publishedAndUpdated ? 'edit' : 'publish'}` }
            onClick={ handlePublish }
          >
            Publish{ publishedAndUpdated && ' Changes' }
          </Button>
        ) }
        { data.project.status !== 'DRAFT' && <Button className="project_button project_button--publish" onClick={ handleUnPublish }>Unpublish</Button> }
      </section>
    </div>
  );
};

VideoReview.propTypes = {
  id: string,
  data: object,
  client: object,
  statusChange: object,
  deleteProject: func,
  publishProject: func,
  unPublishProject: func,
  removeUpdatedProjectFromCache: func,
};

const deleteProjectMutation = graphql( DELETE_VIDEO_PROJECT_MUTATION, {
  name: 'deleteProject',
  options: props => ( {
    variables: { id: props.id }
  } )
} );

const publishProjectMutation = graphql( PUBLISH_VIDEO_PROJECT_MUTATION, {
  name: 'publishProject',
  options: props => ( {
    variables: { id: props.id }
  } )
} );

const unPublishProjectMutation = graphql( UNPUBLISH_VIDEO_PROJECT_MUTATION, {
  name: 'unPublishProject',
  options: props => ( {
    variables: { id: props.id }
  } )
} );

const projectStatusChangeSubscription = graphql( PROJECT_STATUS_CHANGE_SUBSCRIPTION, {
  name: 'statusChange',
  options: props => ( {
    variables: { id: props.id },
    onSubscriptionData: ( { subscriptionData } ) => {
      console.log( 'Subscription data received...' );
      const { data: { projectStatusChange } } = subscriptionData;
      console.dir( projectStatusChange );
      if ( projectStatusChange.status === 'PUBLISHED' || projectStatusChange.status === 'DRAFT' ) {
        Router.push( { pathname: '/admin/dashboard' } );
      }
    }
  } )
} );

const videoReviewQuery = graphql( VIDEO_PROJECT_QUERY, {
  options: props => ( {
    variables: { id: props.id }
  } )
} );

const removeUpdatedProjectsCacheMutation = graphql( REMOVE_UPDATED_PROJECTS_CACHE_MUTATION, {
  name: 'removeUpdatedProjectFromCache',
} );

export default compose(
  withApollo,
  deleteProjectMutation,
  publishProjectMutation,
  unPublishProjectMutation,
  projectStatusChangeSubscription,
  videoReviewQuery,
  removeUpdatedProjectsCacheMutation,
)( VideoReview );
