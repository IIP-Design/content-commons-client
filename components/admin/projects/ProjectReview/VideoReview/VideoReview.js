import React, { useState } from 'react';
import { func, object, string } from 'prop-types';
import Router from 'next/router';
import gql from 'graphql-tag';
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
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';

import { PUBLISH_VIDEO_PROJECT_MUTATION } from 'lib/graphql/queries/video';
import {
  DELETE_VIDEO_PROJECT_MUTATION
} from 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit';

import './VideoReview.scss';

const VideoReview = props => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );

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

  const handleDeleteProject = () => {
    const { deleteProject } = props;
    console.log( `Deleted project: ${id}` );
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
    const result = await publishProject( { variables: { id } } );
    if ( result ) {
      console.log( `Published project: ${id}` );
      Router.push( { pathname: '/admin/dashboard' } );
    }
  };

  return (
    <div className="review-project">
      <Breadcrumbs />
      <ProjectHeader icon="video camera" text="Project Details - Review">
        <Button
          content="Delete Project"
          className="project_button project_button--delete"
          onClick={ displayConfirmDelete }
        />

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
        <Button className="project_button project_button--publish" onClick={ handlePublish }>Publish</Button>
      </ProjectHeader>

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
  publishProject: func
};

const VIDEO_REVIEW_PROJECT_QUERY = gql`
  query VideoReviewProject($id: ID!) {
    project: videoProject(id: $id) {
      id
    }
  }
`;

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

const videoReviewQuery = graphql( VIDEO_REVIEW_PROJECT_QUERY, {
  options: props => ( {
    variables: { id: props.id }
  } )
} );

export default compose(
  deleteProjectMutation,
  publishProjectMutation,
  videoReviewQuery
)( VideoReview );

export { VIDEO_REVIEW_PROJECT_QUERY };
