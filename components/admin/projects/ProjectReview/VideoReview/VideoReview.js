import React, { Fragment, useState } from 'react';
import { func, object, string } from 'prop-types';
import Router from 'next/router';
import { compose, graphql } from 'react-apollo';
import {
  Button, Confirm, Grid, Icon, Loader
} from 'semantic-ui-react';

import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import VideoProjectData from 'components/admin/projects/ProjectReview/VideoProjectData/VideoProjectData';
import VideoSupportFiles from 'components/admin/projects/ProjectReview/VideoSupportFiles/VideoSupportFiles';
import VideoProjectFiles from 'components/admin/projects/ProjectReview/VideoProjectFiles/VideoProjectFiles';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import PreviewProject from 'components/admin/PreviewProject/PreviewProject';
import PreviewProjectContent from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';
import ApolloError from 'components/errors/ApolloError';

import {
  PUBLISH_VIDEO_PROJECT_MUTATION,
  UNPUBLISH_VIDEO_PROJECT_MUTATION,
  DELETE_VIDEO_PROJECT_MUTATION,
  VIDEO_PROJECT_QUERY
} from 'lib/graphql/queries/video';
import { findAllValuesForKey } from 'lib/utils';

import './VideoReview.scss';

const VideoReview = props => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [publishError, setPublishError] = useState( null );

  const { id, data, data: { error, loading } } = props;

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

  const updatesToPublish = () => {
    const { project } = data;
    if ( project ) {
      // updatedAt at the project level does not account for nested updates
      // so we need to find all updatedAt props to locate most recent update
      const allUpdates = findAllValuesForKey( project, 'updatedAt' );
      const mostRecentUpdate = allUpdates.reduce( ( max, p ) => ( p > max ? p : max ), allUpdates[0] );
      const { status, publishedAt } = project;

      if ( status === 'PUBLISHED' || status === 'PUBLISHED_MODIFIED' ) {
        const lastUpdate = new Date( mostRecentUpdate ).getTime();
        const publishDate = new Date( publishedAt ).getTime();

        // At publish time, updatedAt and pubishedAt are approximately equal so
        // we add 10 seconds so that Update does not show right after a publish
        if ( publishedAt && ( lastUpdate > ( publishDate + 10000 ) ) ) { return true; }
      }
    }

    return false;
  };

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

  const handlePublish = async () => {
    const { publishProject } = props;

    try {
      await publishProject( { variables: { id } } );
      Router.push( { pathname: '/admin/dashboard' } );
    } catch ( err ) {
      setPublishError( err );
    }
  };

  const handleUnPublish = async () => {
    const { unPublishProject } = props;

    try {
      await unPublishProject( { variables: { id } } );
      Router.push( { pathname: '/admin/dashboard' } );
    } catch ( err ) {
      setPublishError( err );
    }
  };

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

        <PreviewProject
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
          ? <Button className="project_button project_button--publish" onClick={ handlePublish }>Publish</Button>
          : (
            <Fragment>
              { updatesToPublish() && (
                <Button className="project_button project_button--publish" onClick={ handlePublish }>Update</Button>
              )
              }
              <Button className="project_button project_button--publish" onClick={ handleUnPublish }>UnPublish</Button>
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
        <h3 className="title">Your project looks great! Are you ready to Publish?</h3>
        <Button
          className="project_button project_button--edit"
          content="Edit"
          onClick={ handleEdit }
        />
        <Button className="project_button project_button--publish" onClick={ handlePublish }>Publish</Button>
      </section>
    </div>
  );
};

VideoReview.propTypes = {
  id: string,
  data: object,
  deleteProject: func,
  publishProject: func,
  unPublishProject: func
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

const videoReviewQuery = graphql( VIDEO_PROJECT_QUERY, {
  options: props => ( {
    variables: { id: props.id }
  } )
} );

export default compose(
  deleteProjectMutation,
  publishProjectMutation,
  unPublishProjectMutation,
  videoReviewQuery
)( VideoReview );
