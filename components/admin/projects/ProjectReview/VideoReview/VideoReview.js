/**
 *
 * VideoReview
 *
 */
import React from 'react';
import {
  bool, func, object, string
} from 'prop-types';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import { Button, Confirm, Grid } from 'semantic-ui-react';

import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import VideoProjectData from 'components/admin/projects/ProjectReview/VideoProjectData/VideoProjectData';
import VideoSupportFiles from 'components/admin/projects/ProjectReview/VideoSupportFiles/VideoSupportFiles';
import VideoProjectFiles from 'components/admin/projects/ProjectReview/VideoProjectFiles/VideoProjectFiles';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';

import { DELETE_VIDEO_PROJECT_MUTATION } from 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit';

import './VideoReview.scss';

class VideoReview extends React.PureComponent {
  state = {
    deleteConfirmOpen: false
  }

  displayConfirmDelete = () => {
    this.setState( { deleteConfirmOpen: true } );
  }

  handleDeleteConfirm = () => {
    this.setState( { deleteConfirmOpen: false } );
    const { id, mutate } = this.props;
    console.log( `Deleted project: ${id}` );
    mutate( { variables: { id } } );
    Router.push( { pathname: '/admin/dashboard' } );
  }

  handleDeleteCancel = () => {
    this.setState( { deleteConfirmOpen: false } );
  }

  toggleDisableRightClick = () => {
    this.props.toggleDisableRightClick( this.props.match.params.videoID );
  }

  handleEdit = () => {
    const { id } = this.props;
    Router.push( {
      pathname: `/admin/project/video/${id}/edit`
    } );
  }

  handlePublish = () => {
    Router.push( { pathname: '/admin/dashboard' } );
  }

  render() {
    const { id, disableRightClick } = this.props;

    return (
      <div className="review-project">
        <ProjectHeader icon="video camera" text="Project Details - Review">
          <div className="button_column_wrapper">
            <div className="button_delete_wrapper">
              <Button
                className="project_button project_button--delete"
                onClick={ this.displayConfirmDelete }
              >
                Delete Project
              </Button>
              <Confirm
                className="delete"
                open={ this.state.deleteConfirmOpen }
                content={ (
                  <ConfirmModalContent
                    className="delete_confirm delete_confirm--video"
                    headline="Are you sure you want to delete this video project?"
                  >
                    <p>This video project will be permanently removed from the Content Cloud. Any videos that you uploaded here will not be uploaded.</p>
                  </ConfirmModalContent>
                ) }
                onCancel={ this.handleDeleteCancel }
                onConfirm={ this.handleDeleteConfirm }
                cancelButton="No, take me back"
                confirmButton="Yes, delete forever"
              />
            </div>
            <Button
              className="project_button project_button--edit"
              content="Edit"
              onClick={ this.handleEdit }
            />
          </div>

          <div className="button_column_wrapper">
            <Button className="project_button project_button--preview">Preview Project</Button>
            <Button className="project_button project_button--publish" onClick={ this.handlePublish }>Publish</Button>
          </div>
        </ProjectHeader>

        <Grid stackable>
          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 8 }>
              <VideoProjectData id={ id } />
            </Grid.Column>

            <Grid.Column mobile={ 16 } computer={ 8 }>
              <VideoSupportFiles
                id={ id }
                disableRightClick={ disableRightClick }
                toggleDisableRightClick={ this.toggleDisableRightClick }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <VideoProjectFiles id={ id } />

        <section className="section section--publish">
          <h3 className="title">Your project looks great! Are you ready to Publish?</h3>
          <Button
            className="project_button project_button--edit"
            content="Edit"
            onClick={ this.handleEdit }
          />
          <Button className="project_button project_button--publish" onClick={ this.handlePublish }>Publish</Button>
        </section>
      </div>
    );
  }
}

VideoReview.propTypes = {
  id: string,
  match: object,
  disableRightClick: bool,
  toggleDisableRightClick: func,
  mutate: func
};

export default graphql( DELETE_VIDEO_PROJECT_MUTATION )( VideoReview );
