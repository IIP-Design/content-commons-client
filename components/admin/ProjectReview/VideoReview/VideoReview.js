import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import usePublish from 'lib/hooks/usePublish';
import useIsDirty from 'lib/hooks/useIsDirty';
import {
  Button, Confirm, Grid, Icon, Loader
} from 'semantic-ui-react';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import VideoProjectData from 'components/admin/ProjectReview/VideoProjectData/VideoProjectData';
import VideoSupportFiles from 'components/admin/ProjectReview/VideoSupportFiles/VideoSupportFiles';
import VideoProjectFiles from 'components/admin/ProjectReview/VideoProjectFiles/VideoProjectFiles';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import ProjectPreview from 'components/admin/ProjectPreview/ProjectPreview';
import ProjectPreviewContent from 'components/admin/ProjectPreview/ProjectPreviewContent/ProjectPreviewContent';
import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';
import ApolloError from 'components/errors/ApolloError';
import {
  PUBLISH_VIDEO_PROJECT_MUTATION,
  UNPUBLISH_VIDEO_PROJECT_MUTATION,
  DELETE_VIDEO_PROJECT_MUTATION,
  UPDATE_VIDEO_PROJECT_MUTATION,
  VIDEO_PROJECT_QUERY
} from 'lib/graphql/queries/video';

import './VideoReview.scss';

const VideoReview = props => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const { id } = props;

  const {
    loading, error, data, startPolling, stopPolling
  } = useQuery( VIDEO_PROJECT_QUERY, {
    variables: { id: props.id },
    // using network-only here to ensure that we have the latest to determine
    // if the project has unpublished changes
    // todo - verify update mutation is returning necessary data to avoid
    // using network policy
    fetchPolicy: 'network-only'
  } );

  const [updateProjectStatus] = useMutation( UPDATE_VIDEO_PROJECT_MUTATION );
  const [publishProject] = useMutation( PUBLISH_VIDEO_PROJECT_MUTATION );
  const [unPublishProject] = useMutation( UNPUBLISH_VIDEO_PROJECT_MUTATION );
  const [deleteProject] = useMutation( DELETE_VIDEO_PROJECT_MUTATION, );

  const {
    publishing,
    publishError,
    executePublishOperation,
    handleStatusChange
  } = usePublish(
    startPolling,
    stopPolling,
    updateProjectStatus
  );

  const isDirty = useIsDirty( data?.project );

  useEffect( () => {
    if ( data && data.project ) {
      // When the data changes, check status
      handleStatusChange( data.project );
    }
  }, [data] );


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


  const displayConfirmDelete = () => setDeleteConfirmOpen( true );
  const handleDeleteCancel = () => setDeleteConfirmOpen( false );

  const setButtonState = btn => `project_button project_button--${btn} ${publishing ? 'loading' : ''}`;

  const handleDeleteProject = async () => {
    try {
      await deleteProject( { variables: { id } } );
      Router.push( { pathname: '/admin/dashboard' } );
    } catch ( err ) {
      console.log( err.toString() );
    }
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

  const handlePublish = async () => {
    executePublishOperation( id, publishProject );
  };

  const handleUnPublish = async () => {
    executePublishOperation( id, unPublishProject );
  };

  const getPublishMessage = () => {
    if ( data?.project?.status === 'PUBLISHED' ) {
      if ( isDirty ) {
        return 'It looks like you made changes to your project. Do you want to publish changes?';
      }
      return 'Not ready to share with the world yet?';
    }
    return 'Your project looks great! Are you ready to Publish?';
  };

  const isPublished = data?.project?.status === 'PUBLISHED';

  return (
    <div className="review-project">
      <ProjectHeader icon="video camera" text="Project Details - Review">
        { data.project.status === 'DRAFT' && (
          <Button
            content="Delete Project"
            className="project_button project_button--delete"
            onClick={ displayConfirmDelete }
          />
        ) }

        <Confirm
          className="delete"
          open={ deleteConfirmOpen }
          content={ (
            <ConfirmModalContent
              className="delete_confirm delete_confirm--video"
              headline="Are you sure you want to delete this video project?"
            >
              <p>
                This video project will be permanently removed from the Content Cloud. Any videos
                that you uploaded here will not be uploaded.
              </p>
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
          modalContent={ ProjectPreviewContent }
          options={ { closeIcon: true } }
        />

        { data.project.status === 'DRAFT' ? (
          <Button className={ setButtonState( 'publish' ) } onClick={ handlePublish }>
            Publish
          </Button>
        ) : (
          <Fragment>
            { isDirty && (
              <Button className={ setButtonState( 'edit' ) } onClick={ handlePublish }>
                Publish Changes
              </Button>
            ) }
            <Button className="project_button project_button--publish" onClick={ handleUnPublish }>
              Unpublish
            </Button>
          </Fragment>
        ) }
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
        <h3 className="title">{ getPublishMessage() }</h3>
        <Button
          className="project_button project_button--edit"
          content="Edit"
          onClick={ handleEdit }
        />

        { /* Project is in draft status and not published */ }
        { !isPublished && (
          <Button className="project_button project_button--publish" onClick={ handlePublish }>
            Publish
          </Button>
        ) }

        { /* Project is published but changes have been made that have not been published */ }
        { isPublished && isDirty && (
          <Button className="project_button project_button--edit" onClick={ handlePublish }>
            Publish Changes
          </Button>
        ) }

        { /* Project is published  */ }
        { isPublished && (
          <Button className="project_button project_button--publish" onClick={ handleUnPublish }>
            UnPublish
          </Button>
        ) }
      </section>
    </div>
  );
};

VideoReview.propTypes = {
  id: PropTypes.string
};


export default VideoReview;
