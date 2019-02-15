/**
 *
 * VideoEditProject
 *
 */
import React, { Fragment } from 'react';
import { Router } from 'next/router';
import { func, number, object } from 'prop-types';
import {
  Button, Confirm, Loader, Progress
} from 'semantic-ui-react';

import Page from 'components/Page';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';

import ConfirmModalContent from 'components/admin/projects/shared/ConfirmModalContent/ConfirmModalContent';
import NavigationPrompt from 'components/admin/projects/shared/NavigationPrompt/NavigationPrompt';
import Notification from 'components/admin/projects/shared/Notification/Notification';
import PreviewProject from 'components/admin/projects/shared/PreviewProject/PreviewProject';
import PreviewProjectContent from 'components/admin/projects/shared/PreviewProjectContent/PreviewProjectContent';
import ProjectHeader from 'components/admin/projects/shared/ProjectHeader/ProjectHeader';
import ProjectSupportFiles from 'components/admin/projects/shared/ProjectSupportFiles/ProjectSupportFiles';
import ProjectItemsList from 'components/admin/projects/shared/ProjectItemsList/ProjectItemsList';
import VisuallyHidden from 'components/admin/projects/shared/VisuallyHidden/VisuallyHidden';

import EditSingleProjectItem from 'components/admin/projects/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';
import FormInstructions from 'components/admin/projects/ProjectEdit/FormInstructions/FormInstructions';
import ProjectDataForm from 'components/admin/projects/ProjectEdit/ProjectDataForm/ProjectDataForm';
import UploadSuccessMsg from 'components/admin/projects/ProjectEdit/UploadSuccessMsg/UploadSuccessMsg';
import VideoItem from 'components/admin/projects/ProjectEdit/VideoItem/VideoItem';

import {
  categoryData,
  privacyOptions,
  supportFilesConfig
} from 'components/admin/projects/ProjectEdit/mockData';

import colors from 'styles/colors.scss';
import './VideoEditProject.scss';

/* eslint-disable react/prefer-stateless-function */
class VideoEditProject extends React.PureComponent {
  constructor( props ) {
    super( props );

    const videosCount = this.props.project.videos.length;

    this.MAX_CATEGORY_COUNT = 2;
    this.SAVE_MSG_DELAY = 2000;
    this.UPLOAD_SUCCESS_MSG_DELAY = this.SAVE_MSG_DELAY + 1000;
    this._isMounted = false;

    this.state = {
      deleteConfirmOpen: false,
      hasBeenDeleted: false,
      hasRequiredData: false,
      hasSubmittedData: false,
      isUploadInProgress: false,
      isUploadFinished: false,
      hasUnsavedData: false,
      displaySaveMsg: false,
      displayTheUploadSuccessMsg: false,
      hasExceededMaxCategories: false,
      filesToUploadCount: videosCount + this.getSupportFilesCount(),
      formData: {
        title: '',
        privacySetting: 'anyone',
        author: '',
        owner: '',
        categories: [],
        tags: [],
        publicDesc: '',
        internalDesc: '',
        termsConditions: false,
        protectImages: true
      }
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    const projectId = this.props.match.params.videoID;
    this.props.loadVideoProjects( projectId );
  }

  componentDidUpdate = ( prevProps, prevState ) => {
    const uploadedCount = this.getUploadedFilesCount();

    if ( uploadedCount === prevState.filesToUploadCount && prevState.hasSubmittedData && !prevState.isUploadFinished ) {
      this.setState(
        {
          isUploadFinished: true,
          isUploadInProgress: false,
          displayTheUploadSuccessMsg: true,
          displaySaveMsg: true
        },
        () => {
          this.delayUnmount( this.handleDisplaySaveMsg, this.saveMsgTimer, this.SAVE_MSG_DELAY );
          this.delayUnmount( this.handleDisplayUploadSuccessMsg, this.uploadSuccessTimer, this.UPLOAD_SUCCESS_MSG_DELAY );
        }
      );
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    clearTimeout( this.uploadSuccessTimer );
    clearTimeout( this.saveMsgTimer );
  }

  getSupportFilesCount = () => {
    const { supportFiles } = this.props.project;
    const types = Object.keys( supportFiles );
    const count = ( acc, cur ) => acc + supportFiles[cur].length;
    return types.reduce( count, 0 );
  }

  getUploadedFilesCount = () => {
    const { uploadedVideosCount, uploadedSupportFilesCount } = this.props;
    return uploadedVideosCount + uploadedSupportFilesCount;
  }

  getTags = () => {
    const { tags } = this.state.formData;
    const tagsArray = ( tags && tags.length > 0 && !Array.isArray( tags ) ) ? tags.split( /\s?[,;]\s?/ ) : tags;

    if ( tagsArray && Array.isArray( tagsArray ) ) {
      return tagsArray
        .map( tag => tag.trim() )
        .filter( tag => /\S/.test( tag ) );
    }
    return [];
  }

  displayConfirmDelete = () => {
    this.setState( { deleteConfirmOpen: true } );
  }

  handleDeleteConfirm = () => {
    const { videoID } = this.props.match.params;
    this.props.deleteVideoProject( videoID );
    console.log( `Deleted "${videoID}" project` );
    this.setState( {
      deleteConfirmOpen: false,
      hasBeenDeleted: true
    } );
  }

  handleDeleteCancel = () => {
    this.setState( { deleteConfirmOpen: false } );
  }

  handleFinalReview = () => {
    const { videoID } = this.props.match.params;
    Router.push( `/admin/video/${videoID}/review` );
  }

  handleAddMoreFiles = () => {
    console.log( 'Add more video files' );
    this.addMoreInputRef.click();
  }

  handleAddMoreRef = c => {
    this.addMoreInputRef = c;
  }

  handleSaveDraft = e => {
    console.log( 'Draft saved' );
    this.handleSubmit( e );
  }

  handleSaveProjectData = () => {
    const { videoID } = this.props.match.params;
    this.props.saveProjectData( videoID, this.state.formData );
  }

  handleUpload = () => this.setState( { isUploadInProgress: true } );

  handleChange = ( e, { name, value, checked } ) => {
    if ( typeof value === 'string' ) {
      /* eslint-disable no-param-reassign */
      value = value.trimStart();
    }

    this.setState( prevState => ( {
      formData: {
        ...prevState.formData,
        [name]: value || checked
      }
    } ) );

    this.setState( nextState => {
      const {
        categories,
        title,
        privacySetting,
        termsConditions
      } = nextState.formData;
      const categoryCount = categories.length;

      return ( {
        hasUnsavedData: true,
        hasExceededMaxCategories: categoryCount > this.MAX_CATEGORY_COUNT,
        hasRequiredData: !!title
          && privacySetting
          && categoryCount > 0
          && categoryCount <= this.MAX_CATEGORY_COUNT
          && termsConditions
      } );
    } );
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      title,
      author,
      owner,
      publicDesc,
      internalDesc,
      termsConditions,
      protectImages
    } = this.state.formData;

    this.setState(
      prevState => ( {
        hasSubmittedData: true,
        hasUnsavedData: false,
        displaySaveMsg: true,
        formData: {
          ...prevState.formData,
          title: title ? title.trimEnd() : '',
          author: author ? author.trimEnd() : '',
          owner: owner ? owner.trimEnd() : '',
          publicDesc: publicDesc ? publicDesc.trimEnd() : '',
          internalDesc: internalDesc ? internalDesc.trimEnd() : '',
          tags: this.getTags(),
          termsConditions,
          protectImages
        }
      } ),
      this.handleSaveProjectData
    );

    if ( !this.state.isUploadFinished ) {
      this.handleUpload();
    } else {
      this.delayUnmount( this.handleDisplaySaveMsg, this.saveMsgTimer, this.SAVE_MSG_DELAY );
    }

    window.scrollTo( { top: 0, behavior: 'smooth' } );
  }

  handleDisplayUploadSuccessMsg = () => {
    if ( this._isMounted ) {
      this.setState( { displayTheUploadSuccessMsg: false } );
    }
    this.uploadSuccessTimer = null;
  }

  handleDisplaySaveMsg = () => {
    if ( this._isMounted ) {
      this.setState( { displaySaveMsg: false } );
    }
    this.saveMsgTimer = null;
  }

  delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  };

  renderConfirm = ( isOpen, onConfirm, onCancel ) => (
    <Fragment>
      <Confirm
        className="confirm-modal"
        open={ isOpen }
        onCancel={ onCancel }
        onConfirm={ onConfirm }
        cancelButton="No"
        confirmButton="Yes"
        content={ (
          <ConfirmModalContent
            className="content"
            headline="Unsaved Changes!"
          >
            <p>You have not finished entering and uploading your project data and content.</p>
            <p>Navigating away from this page now, your changes will not be saved and uploads for this project will be canceled.</p>
            <p><strong>Do you want to leave this page and lose your changes and cancel your uploads?</strong></p>
          </ConfirmModalContent>
        ) }
      />
    </Fragment>
  )

  render() {
    const { project, uploadedSupportFilesCount } = this.props;

    if ( !project && this.state.hasBeenDeleted ) {
      Router.push( '/admin/dashboard' );
    }

    if ( !project || project.loading ) {
      return (
        <div style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        } }
        >
          <Loader active inline="centered" style={ { marginBottom: '1em' } } />
          <p>Loading the project...</p>
        </div>
      );
    }

    const {
      projectType,
      supportFiles,
      videos
    } = project;

    const {
      deleteConfirmOpen,
      hasRequiredData,
      hasSubmittedData,
      isUploadInProgress,
      isUploadFinished,
      hasUnsavedData,
      displaySaveMsg,
      displayTheUploadSuccessMsg,
      hasExceededMaxCategories,
      formData,
      filesToUploadCount
    } = this.state;

    const {
      title,
      privacySetting,
      author,
      owner,
      categories,
      tags,
      publicDesc,
      internalDesc,
      termsConditions,
      protectImages
    } = formData;

    const formBorderColor = `${!hasSubmittedData ? colors.brightBlue : colors.red}`;
    const contentStyle = {
      border: `3px solid ${( hasRequiredData && hasSubmittedData ) ? 'transparent' : `${formBorderColor}`}`
    };

    let notificationMsg = 'Project saved as draft';
    if ( hasSubmittedData && hasUnsavedData && !hasRequiredData ) {
      notificationMsg = 'Please fill in required data';
    } else if ( hasSubmittedData && hasUnsavedData ) {
      notificationMsg = 'You have unsaved data';
    } else if ( isUploadInProgress ) {
      notificationMsg = 'Saving project...';
    }

    return (
      <Page title="Edit Project" description="Edit content project">

        <NavigationPrompt when={ hasUnsavedData || isUploadInProgress }>
          { this.renderConfirm }
        </NavigationPrompt>

        <Breadcrumbs />

        <div className="edit-project">
          <div className="edit-project__header">
            <ProjectHeader icon="video camera" text="Project Details">
              <Button
                className="edit-project__btn--delete"
                content="Delete Project"
                basic
                onClick={ this.displayConfirmDelete }
                disabled={ !isUploadFinished }
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
                onCancel={ this.handleDeleteCancel }
                onConfirm={ this.handleDeleteConfirm }
                cancelButton="No, take me back"
                confirmButton="Yes, delete forever"
              />
              <PreviewProject
                triggerProps={ {
                  className: 'edit-project__btn--preview',
                  content: 'Preview Project',
                  basic: true,
                  disabled: !isUploadFinished
                } }
                contentProps={ {
                  data: project,
                  projecttype: `${projectType}s`
                } }
                modalTrigger={ Button }
                modalContent={ PreviewProjectContent }
                options={ { closeIcon: true } }
              />
              { hasSubmittedData
                && (
                  <Button
                    className="edit-project__btn--save-draft"
                    content="Save Draft"
                    basic
                    onClick={ this.handleSaveDraft }
                    disabled={ !isUploadFinished || !hasUnsavedData || !hasRequiredData }
                  />
                ) }
              <Button
                className="edit-project__btn--final-review"
                content="Final Review"
                onClick={ this.handleFinalReview }
                disabled={ !isUploadFinished }
              />
            </ProjectHeader>
          </div>

          <div className="edit-project__status alpha">
            { !hasSubmittedData && <FormInstructions /> }
            { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

            { ( displaySaveMsg || ( hasUnsavedData && hasSubmittedData ) )
              && (
                <Notification
                  el="p"
                  customStyles={ {
                    position: 'absolute',
                    top: '10.75em',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  } }
                  msg={ notificationMsg }
                />
              ) }

            { isUploadInProgress
              && (
                <Progress
                  value={ this.getUploadedFilesCount() }
                  total={ filesToUploadCount }
                  color="blue"
                  size="medium"
                  active
                >
                  <p>
                    <b>Uploading files:</b> { this.getUploadedFilesCount() } of { filesToUploadCount }
                    <br />
                    Please keep this page open until upload is complete
                  </p>
                </Progress>
              ) }
          </div>

          <div className="edit-project__content" style={ contentStyle }>
            <ProjectDataForm
              handleSubmit={ this.handleSubmit }
              handleChange={ this.handleChange }

              videoTitle={ title || '' }
              privacyOptions={ privacyOptions }
              privacySetting={ privacySetting }

              authorValue={ author || '' }
              ownerValue={ owner || '' }

              categoryLabel="Categories"
              maxCategories={ this.MAX_CATEGORY_COUNT }
              categoryOptions={ categoryData }
              categoriesValue={ categories }
              hasExceededMaxCategories={ hasExceededMaxCategories }
              tagsValue={ tags || '' }

              publicDescValue={ publicDesc }
              internalDescValue={ internalDesc }
              termsConditions={ termsConditions }

              hasSubmittedData={ hasSubmittedData }
              hasRequiredData={ hasRequiredData }
            />
          </div>

          <div className="edit-project__status beta">
            { !hasSubmittedData && <FormInstructions /> }
            { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

            { isUploadInProgress
              && (
                <Progress
                  value={ this.getUploadedFilesCount() }
                  total={ filesToUploadCount }
                  color="blue"
                  size="medium"
                  active
                >
                  <p>
                    <b>Uploading files:</b> { this.getUploadedFilesCount() } of { filesToUploadCount }
                    <br />
                    Please keep this page open until upload is complete
                  </p>
                </Progress>
              ) }
          </div>

          <div className="edit-project__support-files">
            <ProjectSupportFiles
              heading="Support Files"
              projectId={ this.props.match.params }
              supportFiles={ supportFiles }
              hasSubmittedData={ hasSubmittedData }
              protectImages={ protectImages }
              handleChange={ this.handleChange }
              config={ supportFilesConfig }
              hasUploaded={
                this.getSupportFilesCount() === uploadedSupportFilesCount
              }
            />
          </div>

          <div className="edit-project__items">
            <ProjectItemsList
              listEl="ul"
              data={ videos }
              projectId={ this.props.match.params }
              headline="Videos in Project"
              hasSubmittedData={ hasSubmittedData }
              projectType="video"
              displayItemInModal
              modalTrigger={ VideoItem }
              modalContent={ EditSingleProjectItem }
            />

            { hasSubmittedData
              && (
                <div style={ { marginTop: '3rem' } }>
                  <Button
                    className="edit-project__add-more"
                    content="+ Add more files to this project"
                    basic
                    onClick={ this.handleAddMoreFiles }
                  />
                  <VisuallyHidden>
                    { /* eslint-disable jsx-a11y/label-has-for */
                      /* eslint-disable jsx-a11y/label-has-associated-control */ }
                    <label htmlFor="upload-item--multiple">upload more project items</label>
                    <input
                      id="upload-item--multiple"
                      ref={ this.handleAddMoreRef }
                      type="file"
                      accept=".mov, .mp4, .mpg, .wmv, .avi"
                      multiple
                      tabIndex={ -1 }
                    />
                  </VisuallyHidden>
                </div>
              ) }
          </div>
        </div>
      </Page>
    );
  }
}

VideoEditProject.propTypes = {
  history: object,
  match: object,
  project: object,
  loadVideoProjects: func,
  saveProjectData: func,
  deleteVideoProject: func,
  uploadedVideosCount: number,
  uploadedSupportFilesCount: number
};

VideoEditProject.defaultProps = {
  uploadedVideosCount: 0,
  uploadedSupportFilesCount: 0
};

export default VideoEditProject;
