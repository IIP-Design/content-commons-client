/**
 *
 * VideoEdit
 *
 */
import React, { Fragment } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Button, Confirm } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import { uploadToS3, uploadToVimeo } from 'lib/upload';
import mime from 'mime-types';
import { buildUpdateVideoProjectData } from 'lib/graphql/video';

import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/files';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import Notification from 'components/Notification/Notification';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import PreviewProject from 'components/admin/PreviewProject/PreviewProject';
import PreviewProjectContent from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
import ProjectSupportFiles from 'components/admin/ProjectSupportFiles/ProjectSupportFiles';
// import ProjectItemsList from 'components/admin/projects/ProjectEdit/ProjectItemsList/ProjectItemsList';

// import EditSingleProjectItem from 'components/admin/projects/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';
import FormInstructions from 'components/admin/projects/ProjectEdit/FormInstructions/FormInstructions';
import VideoProjectDataForm from 'components/admin/projects/ProjectEdit/VideoProjectDataForm/VideoProjectDataForm';
import UploadSuccessMsg from 'components/admin/projects/ProjectEdit/UploadSuccessMsg/UploadSuccessMsg';
// import VideoItem from 'components/admin/projects/ProjectEdit/VideoItem/VideoItem';
import FileUploadProgressBar from '../FileUploadProgressBar/FileUploadProgressBar';

import './VideoEdit.scss';

const supportFilesConfig = {
  srt: {
    headline: 'SRT Files',
    extensions: ['.srt'],
    popupMsg: 'Some info about what SRT files are.'
  },
  other: {
    headline: 'Additional Files',
    extensions: ['.png', '.jpeg', '.jpg', '.svg', '.mp3', '.pdf', '.psd'],
    popupMsg: 'Additional files that can be used with this video, e.g., audio file, pdf.',
    checkBoxLabel: 'Disable right-click to protect your images',
    checkBoxName: 'protectImages',
    iconMsg: 'Checking this prevents people from downloading and using your images. Useful if your images are licensed.',
    iconSize: 'small',
    iconType: 'info circle'
  }
};

// Fetches id of Thumbnail Use to verify file use type
const IMAGE_USES_QUERY = gql`  
  query IMAGE_USES_QUERY {
    imageUses( where: {
      name_contains: "thumbnail"
    } ) {
      id
      name
    }
}
`;

const UPDATE_VIDEO_PROJECT_MUTATION = gql`
  mutation UPDATE_VIDEO_PROJECT_MUTATION( $data: VideoProjectUpdateInput!, $where:VideoProjectWhereUniqueInput!) {
    updateVideoProject(data: $data, where: $where) {
      id
    }
  }
`;

const DELETE_VIDEO_PROJECT_MUTATION = gql`
  mutation DELETE_VIDEO_PROJECT_MUTATION($id: ID!) {
    deleteVideoProject(id: $id) {
      id
    }
  }
`;

const SIGNED_S3_URL_MUTATION = gql` 
  mutation SIGNED_S3_URL_MUTATION( $contentType: String!, $filename: String!, $projectId: String! ) { 
    getSignedS3Url( contentType: $contentType, filename: $filename, projectId: $projectId ) {
      key
      url
    }
}
`;

const FILE_INFO_MUTATION = gql` 
  mutation FILE_INFO_MUTATION( $path: String! ) { 
    getFileInfo( path: $path) {
     duration
     bitrate
     width
     height
    }
}
`;

export const UploadContext = React.createContext( false );

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
      projectId: props.id,
      isUploadInProgress: false,
      displayTheUploadSuccessMsg: false,
      filesToUploadCount: props.files.length,
      filesUploaded: 0,
      filesTotalSize: 0,
      filesSizeCompleted: 0,
      notificationMessage: '',
      showNotification: false
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    clearTimeout( this.uploadSuccessTimer );
    clearTimeout( this.saveMsgTimer );

    this.props.clearFiles(); // clear redux file store
  }

  isVideo = fileType => fileType.includes( 'video' );

  isImage = fileType => fileType.includes( 'image' );

  /**
   * Return file metadata, ie. duration, bitrate, width, height, etc
   * @param {String} path url to publically available file
 */
  getFileInfo = async path => {
    const res = await this.props.getFileInfo( {
      variables: {
        path
      }
    } ).catch( err => console.dir( err ) );

    return res;
  };

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

  updateNotification = msg => {
    this.setState( {
      notificationMessage: msg,
      showNotification: !!msg
    } );
  }

  addProjectIdToUrl = projectId => {
    const { router } = this.props;

    const path = `${router.asPath}&id=${projectId}`;
    router.replace( router.asPath, path, { shallow: true } );
  }

  delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  };


  handleDeleteConfirm = () => {
    const { id, mutate } = this.props;
    console.log( `Deleted project: ${id}` );
    mutate( { variables: { id } } );
    this.props.router.push( { pathname: '/admin/dashboard' } );
  }

  handleDeleteCancel = () => {
    this.setState( { deleteConfirmOpen: false } );
  }

  handleFinalReview = () => {
    this.props.router.push( {
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

  handleUpload = async data => {
    const { id, projectTitle } = data;
    this.setState( {
      projectId: id
    } );
    const { files, getSignedS3Url } = this.props;

    if ( files && files.length ) {
      this.handleUploadStart( files );

      await Promise.all( files.map( async file => {
        const { fileObject } = file;

        // File type is sometimes empty so attempt to determine valid file type
        file.contentType = fileObject.type ? fileObject.type : mime.lookup( fileObject.name );

        const res = await getSignedS3Url( {
          variables: {
            contentType: file.contentType,
            filename: fileObject.name,
            projectId: id
          }
        } ).catch( err => console.dir( err ) );

        file.s3Path = res.data.getSignedS3Url.key;

        await uploadToS3( res.data.getSignedS3Url.url, file, this.handleUploadProgress );

        const isVideo = this.isVideo( file.contentType );
        const isImage = this.isImage( file.contentType );

        if ( isVideo ) {
          const vimeoRes = await uploadToVimeo( file );
          file.stream = {};
          file.stream.vimeo = vimeoRes.data.link;
        }

        if ( isVideo || isImage ) {
          const fileRes = await this.getFileInfo( file.s3Path );
          if ( fileRes && fileRes.data ) {
            const {
              duration, bitrate, width, height
            } = fileRes.data.getFileInfo;

            file.duration = duration;
            file.bitrate = bitrate;
            file.width = width;
            file.height = height;
          }
        }
      } ) );

      this.handleSaveDraft( id, projectTitle );
      this.handleUploadComplete();
      this.addProjectIdToUrl( id );
    }
  }

  handleSaveDraft = async ( projectId, projectTitle ) => {
    const { files, updateVideoProject, data: { imageUses } } = this.props;
    const data = buildUpdateVideoProjectData( files, imageUses[0].id, projectTitle );

    await updateVideoProject( {
      variables: {
        data,
        where: {
          id: projectId
        }
      }
    } ).catch( err => console.dir( err ) );
  }

  handleUploadStart = files => {
    this.setState( {
      filesTotalSize: files.reduce( ( acc, curr ) => acc + curr.fileObject.size, 0 ),
      filesToUploadCount: files.length,
      isUploadInProgress: true
    } );
  }

  handleUploadProgress = async ( progressEvent, file ) => {
    const loadedChange = progressEvent.loaded - file.loaded;
    this.setState( prevState => ( { filesSizeCompleted: prevState.filesSizeCompleted + loadedChange } ) );
    this.props.uploadProgress( { id: file.id, loaded: progressEvent.loaded } );

    if ( progressEvent.loaded >= progressEvent.total ) {
      this.setState( prevState => ( { filesUploaded: prevState.filesUploaded + 1 } ) );
    }
  }

  handleUploadComplete = () => {
    this.setState( {
      isUploadInProgress: false,
      displayTheUploadSuccessMsg: true,
      notificationMessage: 'Project saved as draft'
    } );

    this.delayUnmount( this.handleDisplaySaveMsg, this.saveMsgTimer, this.SAVE_MSG_DELAY );
    this.delayUnmount( this.handleDisplayUploadSuccessMsg, this.uploadSuccessTimer, this.UPLOAD_SUCCESS_MSG_DELAY );
  }

  handleDisplayUploadSuccessMsg = () => {
    if ( this._isMounted ) {
      this.setState( { displayTheUploadSuccessMsg: false } );
    }
    this.uploadSuccessTimer = null;
  }

  handleDisplaySaveMsg = () => {
    if ( this._isMounted ) {
      this.updateNotification( '' );
    }
    this.saveMsgTimer = null;
  }

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
      deleteConfirmOpen,
      projectId,
      isUploadInProgress,
      displayTheUploadSuccessMsg,
      filesUploaded,
      filesToUploadCount,
      filesTotalSize,
      filesSizeCompleted,
      notificationMessage,
      showNotification
    } = this.state;

    const contentStyle = {
      border: `3px solid ${( projectId ) ? 'transparent' : '#02bfe7'}`
    };

    return (
      <div className="edit-project">
        { /* action buttons at top need to be separate component */ }
        <div className="edit-project__header">
          <ProjectHeader icon="video camera" text="Project Details">
            <ButtonAddFiles
              className="edit-project__btn--final-review"
              onChange={ this.handleUploadTest }
              multiple
            >Upload Files
            </ButtonAddFiles>

            <Button
              className="ui button primary"
              content="File Info"
              basic
              onClick={ this.getFileInfo }
            />

            <Button
              className="edit-project__btn--delete"
              content="Delete Project"
              basic
              onClick={ this.displayConfirmDelete }
              disabled={ !projectId }
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
                disabled: !projectId
              } }
              // contentProps={ { id } }
              modalTrigger={ Button }
              modalContent={ PreviewProjectContent }
              options={ { closeIcon: true } }
            />

            { projectId
              && (
                <Button
                  className="edit-project__btn--save-draft"
                  content="Save Draft"
                  basic
                  onClick={ this.handleSaveDraft }
                  // disabled={ !projectId }
                  // disabled={ !isUploadFinished || !hasUnsavedData || !hasRequiredData }
                />
              ) }
            <Button
              className="edit-project__btn--final-review"
              content="Final Review"
              onClick={ this.handleFinalReview }
              disabled={ !projectId }
            />
          </ProjectHeader>
        </div>

        <div className="edit-project__status alpha">
          { !projectId && <FormInstructions /> }
          { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

          <Notification
            el="p"
            customStyles={ {
              position: 'absolute',
              top: '10.75em',
              left: '50%',
              transform: 'translateX(-50%)'
            } }
            show={ showNotification }
            msg={ notificationMessage }
          />

          { isUploadInProgress
            && (
            <FileUploadProgressBar
              total={ filesTotalSize }
              completed={ filesSizeCompleted }
              filesUploaded={ filesUploaded }
              filesToUploadCount={ filesToUploadCount }
            />
            ) }
        </div>

        <div className="edit-project__content" style={ contentStyle }>
          <VideoProjectDataForm
            id={ projectId }
            updateNotification={ this.updateNotification }
            handleUpload={ this.handleUpload }
            // id="cjuk9tkli025a0707ez4lvaid"
            // handleSubmit={ this.handleSubmit }
            // handleChange={ this.handleChange }
            maxCategories={ this.MAX_CATEGORY_COUNT }

          />
        </div>

        <div className="edit-project__status beta">
          { !projectId && <FormInstructions /> }
          { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

          { isUploadInProgress
            && (
            <FileUploadProgressBar
              total={ filesTotalSize }
              completed={ filesSizeCompleted }
              filesUploaded={ filesUploaded }
              filesToUploadCount={ filesToUploadCount }
            />
            ) }
        </div>

        { /* support files */ }
        <div className="edit-project__support-files">
          <UploadContext.Provider value={ isUploadInProgress }>
            <ProjectSupportFiles
              heading="Support Files"
              projectId={ projectId }
              config={ supportFilesConfig }
            />
          </UploadContext.Provider>
        </div>

        <div className="edit-project__items">
          { /* project thumbnails */ }
          { /* <ProjectItemsList
            listEl="ul"
            projectId={ this.props.id }
            headline="Videos in Project"
            hasSubmittedData={ hasSubmittedData }
            projectType="video"
            displayItemInModal
            modalTrigger={ VideoItem }
            modalContent={ EditSingleProjectItem }
          /> */ }

          { /* Add more files button */ }
          { projectId
            && (
              <div style={ { marginTop: '3rem' } }>
                <Button
                  className="edit-project__add-more"
                  content="+ Add more files to this project"
                  basic
                  onClick={ this.handleAddMoreFiles }
                />
                <VisuallyHidden>
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
  id: PropTypes.string,
  data: PropTypes.object,
  mutate: PropTypes.func,
  getSignedS3Url: PropTypes.func,
  getFileInfo: PropTypes.func,
  updateVideoProject: PropTypes.func,
  router: PropTypes.object,
  files: PropTypes.array, // from redux
  clearFiles: PropTypes.func, // from redux
  uploadProgress: PropTypes.func, // from redux
};

const mapStateToProps = state => ( {
  files: state.files
} );

export default compose(
  withRouter,
  connect( mapStateToProps, actions ),
  graphql( SIGNED_S3_URL_MUTATION, { name: 'getSignedS3Url' } ),
  graphql( FILE_INFO_MUTATION, { name: 'getFileInfo' } ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, { name: 'updateVideoProject' } ),
  graphql( DELETE_VIDEO_PROJECT_MUTATION ),
  graphql( IMAGE_USES_QUERY )
)( VideoEdit );


export { DELETE_VIDEO_PROJECT_MUTATION };
