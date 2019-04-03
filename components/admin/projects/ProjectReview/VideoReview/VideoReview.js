/**
 *
 * VideoReview
 *
 */
import React, { useState } from 'react';
import { func, object, string } from 'prop-types';
import Router from 'next/router';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { Button, Confirm, Grid } from 'semantic-ui-react';

import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import VideoProjectData from 'components/admin/projects/ProjectReview/VideoProjectData/VideoProjectData';
import VideoSupportFiles from 'components/admin/projects/ProjectReview/VideoSupportFiles/VideoSupportFiles';
import VideoProjectFiles from 'components/admin/projects/ProjectReview/VideoProjectFiles/VideoProjectFiles';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import PreviewProject from 'components/admin/PreviewProject/PreviewProject';
import PreviewProjectContent from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';

import { DELETE_VIDEO_PROJECT_MUTATION } from 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit';

import './VideoReview.scss';

const VideoReview = props => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );

  const { id, data } = props;

  if ( !data.project ) return <ProjectNotFound />;

  const displayConfirmDelete = () => setDeleteConfirmOpen( true );
  const handleDeleteCancel = () => setDeleteConfirmOpen( false );

  const handleDeleteProject = () => {
    const { deleteProject } = props;
    console.log( `Deleted project: ${id}` );
    deleteProject( { variables: { id } } );
    Router.push( { pathname: '/admin/dashboard' } );
  };

  const handleEdit = () => (
    Router.push( {
      pathname: `/admin/project/video/${id}/edit`
    } )
  );

  const handlePublish = () => {
    Router.push( { pathname: '/admin/dashboard' } );
  };

  return (
    <div className="review-project">
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
  deleteProject: func
};

const VIDEO_REVIEW_PROJECT = gql`
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

const videoReviewQuery = graphql( VIDEO_REVIEW_PROJECT, {
  options: props => ( {
    variables: { id: props.id }
  } )
} );

export default compose(
  deleteProjectMutation,
  videoReviewQuery
)( VideoReview );
