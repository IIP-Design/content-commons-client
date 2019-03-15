/**
 *
 * VideoEdit
 *
 */
import React, { Fragment } from 'react';
import Router from 'next/router';
import { number, object, string } from 'prop-types';
import {
  Button, Confirm, Loader, Progress
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import ConfirmModalContent from 'components/admin/projects/shared/ConfirmModalContent/ConfirmModalContent';
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

import './VideoEdit.scss';

const categoryData = [
  {
    value: 'about-america',
    text: 'About America'
  },
  {
    value: 'arts-and-culture',
    text: 'Arts & Culture'
  },
  {
    value: 'democracy-and-civil-society',
    text: 'Democracy & Civil Society'
  },
  {
    value: 'economic-issues',
    text: 'Economic Issues'
  },
  {
    value: 'education',
    text: 'Education'
  },
  {
    value: 'environment',
    text: 'Environment'
  },
  {
    value: 'geography',
    text: 'Geography'
  },
  {
    value: 'global-issues',
    text: 'Global Issues'
  },
  {
    value: 'good-governance',
    text: 'Good Governance'
  },
  {
    value: 'health',
    text: 'Health'
  },
  {
    value: 'human-rights',
    text: 'Human Rights'
  },
  {
    value: 'press-and-journalism',
    text: 'Press & Journalism'
  },
  {
    value: 'religion-and-values',
    text: 'Religion & Values'
  },
  {
    value: 'science-and-technology',
    text: 'Science & Technology'
  },
  {
    value: 'sports',
    text: 'Sports'
  }
];

const supportFilesConfig = {
  srt: {
    headline: 'SRT Files',
    fileType: 'srt',
    popupMsg: 'Some info about what SRT files are.'
  },
  other: {
    headline: 'Additional Files',
    fileType: 'other',
    popupMsg: 'Additional files that can be used with this video, e.g., audio file, pdf.',
    checkBoxLabel: 'Disable right-click to protect your images',
    checkBoxName: 'protectImages',
    iconMsg: 'Checking this prevents people from downloading and using your images. Useful if your images are licensed.',
    iconSize: 'small',
    iconType: 'info circle'
  }
};

const VIDEO_PROJECT_UNITS_QUERY = gql`
  query VideoProjectUnits($id: ID!) {
    videoProject(id: $id) {
      units {
        id
        title
        descPublic
        language {
          languageCode
          displayName
          textDirection
        }
        files {
          id
          filename
          url
          filesize
          videoBurnedInStatus
          dimensions {
            width
            height
          }
          stream {
            site
            embedUrl
          }
        }
      }
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
class VideoEdit extends React.PureComponent {
  constructor( props ) {
    super( props );

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
      filesToUploadCount: this.getFilesToUploadCount(),
      formData: {
        projectTitle: '',
        visibility: 'PUBLIC',
        author: '',
        team: '',
        categories: [],
        tags: [],
        descPublic: '',
        descInternal: '',
        termsConditions: false,
        protectImages: true
      }
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
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

  getVideosCount = () => {
    const { videos } = this.props.project;
    if ( videos ) {
      return videos.length;
    }
  }

  getSupportFilesCount = () => {
    const { supportFiles } = this.props.project;
    if ( supportFiles ) {
      return supportFiles.length;
    }
  }

  getFilesToUploadCount = () => (
    this.getVideosCount() + this.getSupportFilesCount()
  )

  getUploadedFilesCount = () => {
    const { uploadedVideosCount, uploadedSupportFilesCount } = this.props;
    return uploadedVideosCount + uploadedSupportFilesCount;
  }

  getSRTs = () => {
    const { supportFiles } = this.props.project;
    if ( supportFiles ) {
      return supportFiles.filter( file => file.filetype === 'srt' );
    }
  }

  getOtherSupportFiles = () => {
    const { supportFiles } = this.props.project;
    if ( supportFiles ) {
      return supportFiles.filter( file => file.filetype !== 'srt' );
    }
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
    const videoID = this.props.project.projectId;
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
    Router.push( {
      pathname: '/admin/project',
      query: {
        content: 'video',
        id: this.props.id
      }
    } );
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
    console.log( 'Save project data' );
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
        projectTitle,
        visibility,
        termsConditions
      } = nextState.formData;
      const categoryCount = categories.length;

      return ( {
        hasUnsavedData: true,
        hasExceededMaxCategories: categoryCount > this.MAX_CATEGORY_COUNT,
        hasRequiredData: !!projectTitle
          && visibility
          && categoryCount > 0
          && categoryCount <= this.MAX_CATEGORY_COUNT
          && termsConditions
      } );
    } );
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      projectTitle,
      author,
      team,
      descPublic,
      descInternal,
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
          projectTitle: projectTitle ? projectTitle.trimEnd() : '',
          author: author ? author.trimEnd() : '',
          team: team ? team.trimEnd() : '',
          descPublic: descPublic ? descPublic.trimEnd() : '',
          descInternal: descInternal ? descInternal.trimEnd() : '',
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
      Router.push( { pathname: '/admin/dashboard' } );
    }

    if ( !project ) {
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

    const { videos, supportFiles } = project;

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
      projectTitle,
      visibility,
      author,
      team,
      categories,
      tags,
      descPublic,
      descInternal,
      termsConditions,
      protectImages
    } = formData;

    const formBorderColor = `${!hasSubmittedData ? '#02bfe7' : '#cd2026'}`;
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

    const hasSupportFiles = supportFiles && supportFiles.length > 0;

    return (
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

            <Query query={ VIDEO_PROJECT_UNITS_QUERY } variables={ { id: this.props.id } }>
              { ( { loading, error, data } ) => {
                if ( loading ) return 'Loading...';
                if ( error ) return `Error! ${error.message}`;

                return (
                  <PreviewProject
                    triggerProps={ {
                      className: 'edit-project__btn--preview',
                      content: 'Preview Project',
                      basic: true,
                      disabled: !isUploadFinished
                    } }
                    contentProps={ {
                      id: this.props.id,
                      data: data.videoProject.units,
                    } }
                    modalTrigger={ Button }
                    modalContent={ PreviewProjectContent }
                    options={ { closeIcon: true } }
                  />
                );
              } }
            </Query>

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

            videoTitle={ projectTitle || '' }
            visibilityOptions={ [{
              value: 'PUBLIC',
              text: 'Anyone can see this project'
            },
            {
              value: 'INTERNAL',
              text: 'need text for this'
            }] }
            visibility={ visibility }

            authorValue={ author || '' }
            teamValue={ team || '' }

            categoryLabel="Categories"
            maxCategories={ this.MAX_CATEGORY_COUNT }
            categoryOptions={ categoryData }
            categoriesValue={ categories }
            hasExceededMaxCategories={ hasExceededMaxCategories }
            tagsValue={ tags || '' }

            descPublicValue={ descPublic }
            descInternalValue={ descInternal }
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

        { hasSupportFiles
          && (
            <div className="edit-project__support-files">
              <ProjectSupportFiles
                heading="Support Files"
                projectId={ { videoID: this.props.project.projectId } }
                supportFiles={ {
                  srt: this.getSRTs(),
                  other: this.getOtherSupportFiles()
                } }
                hasSubmittedData={ hasSubmittedData }
                protectImages={ protectImages }
                handleChange={ this.handleChange }
                config={ supportFilesConfig }
                hasUploaded={
                  this.getSupportFilesCount() === uploadedSupportFilesCount
                }
              />
            </div>
          )
        }

        <div className="edit-project__items">
          <ProjectItemsList
            listEl="ul"
            data={ videos }
            projectId={ { videoID: this.props.project.projectId } }
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
    );
  }
}

VideoEdit.propTypes = {
  id: string,
  project: object.isRequired,
  uploadedVideosCount: number,
  uploadedSupportFilesCount: number
};

VideoEdit.defaultProps = {
  uploadedVideosCount: 0,
  uploadedSupportFilesCount: 0
};

export default VideoEdit;
