/**
 *
 * VideoEdit
 *
 */
import React, { Fragment } from 'react';
import Router from 'next/router';
import { func, object, string } from 'prop-types';
import {
  Button, Confirm, Loader, Progress
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import orderBy from 'lodash/orderBy';

import Notification from 'components/Notification/Notification';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import PreviewProject from 'components/admin/PreviewProject/PreviewProject';
import PreviewProjectContent from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
import ProjectSupportFiles from 'components/admin/ProjectSupportFiles/ProjectSupportFiles';
import ProjectItemsList from 'components/admin/projects/ProjectEdit/ProjectItemsList/ProjectItemsList';

import EditSingleProjectItem from 'components/admin/projects/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';
import FormInstructions from 'components/admin/projects/ProjectEdit/FormInstructions/FormInstructions';
import ProjectDataForm from 'components/admin/projects/ProjectEdit/ProjectDataForm/ProjectDataForm';
import UploadSuccessMsg from 'components/admin/projects/ProjectEdit/UploadSuccessMsg/UploadSuccessMsg';
import VideoItem from 'components/admin/projects/ProjectEdit/VideoItem/VideoItem';

import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';

import { getPluralStringOrNot } from 'lib/utils';

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
    headline: 'SRT File',
    fileType: 'srt',
    popupMsg: 'Some info about what SRT files are.'
  },
  other: {
    headline: 'Additional File',
    fileType: 'other',
    popupMsg: 'Additional files that can be used with this video, e.g., audio file, pdf.',
    checkBoxLabel: 'Disable right-click to protect your images',
    checkBoxName: 'protectImages',
    iconMsg: 'Checking this prevents people from downloading and using your images. Useful if your images are licensed.',
    iconSize: 'small',
    iconType: 'info circle'
  }
};

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
      hasRequiredData: false,
      hasSubmittedData: false,
      isUploadInProgress: false,
      isUploadFinished: false,
      hasUnsavedData: false,
      displaySaveMsg: false,
      displayTheUploadSuccessMsg: false,
      hasExceededMaxCategories: false,
      uploadedVideosCount: 0,
      uploadedSupportFilesCount: 0,
      filesToUploadCount: 0,
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
    this.setState( {
      filesToUploadCount: this.getFilesToUploadCount()
    } );
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
    const { project } = this.props.data;
    if ( project ) {
      return project.videos.length;
    }
  }

  getSupportFilesCount = () => {
    const { project } = this.props.data;
    if ( project ) {
      return project.srt.length + project.other.length;
    }
  }

  getFilesToUploadCount = () => (
    this.getVideosCount() + this.getSupportFilesCount()
  )

  getUploadedFilesCount = () => {
    const { uploadedVideosCount, uploadedSupportFilesCount } = this.state;
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
    const { id, mutate } = this.props;
    console.log( `Deleted project: ${id}` );
    mutate( { variables: { id } } );
    Router.push( { pathname: '/admin/dashboard' } );
  }

  handleDeleteCancel = () => {
    this.setState( { deleteConfirmOpen: false } );
  }

  handleFinalReview = () => {
    Router.push( {
      pathname: `/admin/project/video/${this.props.id}`
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
    const {
      id,
      data
    } = this.props;
    const { error, loading } = data;

    if ( error ) return `Error! ${error.message}`;

    if ( loading ) {
      return (
        <div style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
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

    if ( !data.project ) return <ProjectNotFound />;

    const { other, srt, videos } = data.project;

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

    const hasSupportFiles = ( srt && srt.length > 0 ) || ( other && other.length > 0 );

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

            <PreviewProject
              triggerProps={ {
                className: 'edit-project__btn--preview',
                content: 'Preview Project',
                basic: true,
                disabled: !isUploadFinished
              } }
              contentProps={ { id } }
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
                heading={
                  getPluralStringOrNot( [...srt, ...other], 'Support File' )
                }
                projectId={ this.props.id }
                supportFiles={ {
                  srt,
                  other: orderBy( other, ['filetype'] )
                } }
                hasSubmittedData={ hasSubmittedData }
                protectImages={ protectImages }
                handleChange={ this.handleChange }
                config={ supportFilesConfig }
                hasUploaded={ isUploadFinished }
              />
            </div>
          )
        }

        <div className="edit-project__items">
          <ProjectItemsList
            listEl="ul"
            projectId={ this.props.id }
            headline={
              `${getPluralStringOrNot( videos, 'Video' )} in Project`
            }
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
  data: object.isRequired,
  mutate: func
};

const VIDEO_PROJECT_QUERY = gql`
  query VideoProject($id: ID!) {
    project: videoProject(id: $id) {
      videos: units {
        id
      }
      srt: supportFiles(
        where: { filetype: "srt" },
        orderBy: filename_ASC
      ) {
        id
      }
      other: supportFiles(
        where: { filetype_not: "srt" },
        orderBy: filename_ASC
      ) {
        id
      }
    }
  }
`;

const DELETE_VIDEO_PROJECT_MUTATION = gql`
  mutation DeleteVideoProject($id: ID!) {
    deleteVideoProject(id: $id) {
      id
    }
  }
`;

const videoProjectQuery = graphql( VIDEO_PROJECT_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} );

const deleteVideoProjectMutation = graphql( DELETE_VIDEO_PROJECT_MUTATION );

export default compose(
  deleteVideoProjectMutation,
  videoProjectQuery
)( VideoEdit );

export {
  supportFilesConfig,
  DELETE_VIDEO_PROJECT_MUTATION,
  VIDEO_PROJECT_QUERY
};
