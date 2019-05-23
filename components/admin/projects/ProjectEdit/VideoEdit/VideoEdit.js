/**
 *
 * VideoEdit
 *
 */
import React, {
  Fragment, useState, useEffect, useContext
} from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Button, Confirm } from 'semantic-ui-react';

import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/upload';

import { uploadToS3, uploadToVimeo, getFileMetadata } from 'lib/upload';
import { buildUpdateVideoProjectTree } from 'lib/graphql/builders/video';
import { buildThumbnailTree } from 'lib/graphql/builders/common';
import {
  UPDATE_VIDEO_PROJECT_MUTATION,
  DELETE_VIDEO_PROJECT_MUTATION,
  UPDATE_VIDEO_UNIT_MUTATION,
  VIDEO_PROJECT_FILES_QUERY,
  VIDEO_PROJECT_UNITS_QUERY
} from 'lib/graphql/queries/video';
import { IMAGE_USES_QUERY } from 'lib/graphql/queries/common';
import { SIGNED_S3_URL_MUTATION, FILE_INFO_MUTATION } from 'lib/graphql/queries/util';

import Notification from 'components/Notification/Notification';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import PreviewProject from 'components/admin/ProjectPreview/ProjectPreview';
import PreviewProjectContent from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
import ProjectSupportFiles from 'components/admin/ProjectSupportFiles/ProjectSupportFiles';
import ProjectUnitItems from 'components/admin/projects/ProjectEdit/ProjectUnitItems/ProjectUnitItems';
// import EditSingleProjectItem from 'components/admin/projects/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';
import FormInstructions from 'components/admin/projects/ProjectEdit/FormInstructions/FormInstructions';
import VideoProjectDataForm from 'components/admin/projects/ProjectEdit/VideoProjectDataForm/VideoProjectDataForm';
import UploadSuccessMsg from 'components/admin/projects/ProjectEdit/UploadSuccessMsg/UploadSuccessMsg';
import FileUploadProgressBar from 'components/admin/projects/ProjectEdit/FileUploadProgressBar/FileUploadProgressBar';
// import VideoItem from 'components/admin/projects/ProjectEdit/VideoItem/VideoItem';

import { config } from './config';

import './VideoEdit.scss';

export const UploadContext = React.createContext( false );

/* eslint-disable react/prefer-stateless-function */
const VideoEdit = props => {
  const MAX_CATEGORY_COUNT = 2;
  const SAVE_MSG_DELAY = 2000;
  const UPLOAD_SUCCESS_MSG_DELAY = SAVE_MSG_DELAY + 1000;

  let addMoreInputRef = null;
  let uploadSuccessTimer = null;
  let saveMsgTimer = null;

  const [mounted, setMounted] = useState( false );
  const [projectId, setProjectId] = useState( props.id );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [displayTheUploadSuccessMsg, setDisplayTheUploadSuccessMsg] = useState( false );

  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false
  } );

  const { upload: { isUploading, filesToUpload } } = props;

  useEffect( () => {
    setMounted( true );
    return () => {
      setMounted( false );
      clearTimeout( uploadSuccessTimer );
      clearTimeout( saveMsgTimer );

      props.uploadReset(); // clear files to upload store
    };
  }, [] );


  const updateNotification = msg => {
    setNotification( {
      notificationMessage: msg,
      showNotification: !!msg
    } );
  };


  const addProjectIdToUrl = id => {
    const { router } = props;

    const path = `${router.asPath}&id=${id}`;
    router.replace( router.asPath, path, { shallow: true } );
    setProjectId( id );
  };

  const delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  };


  const handleDeleteConfirm = () => {
    const { id, mutate } = props;
    console.log( `Deleted project: ${id}` );
    mutate( { variables: { id } } );
    props.router.push( { pathname: '/admin/dashboard' } );
  };

  // const handleDeleteCancel = () => {
  //   setDeleteConfirmOpen( false );
  // };

  const handleFinalReview = () => {
    props.router.push( {
      pathname: '/admin/project',
      query: {
        content: 'video',
        id: props.id
      }
    } );
  };

  const handleAddMoreFiles = () => {
    console.log( 'Add more video files' );
    addMoreInputRef.click();
  };

  const handleAddMoreRef = c => {
    addMoreInputRef = c;
  };

  const connectUnitThumbnails = async res => {
    const { data: { updateVideoProject: { units, thumbnails } } } = res;
    const { updateVideoUnit } = props;

    if ( units.length && thumbnails.length ) {
      units.forEach( async unit => {
        let thumbnail = thumbnails.find( tn => tn.language.id === unit.language.id );

        // if an applicable language thumbnail doesn't exist, use english version if available
        thumbnail = thumbnail || thumbnails.find( tn => tn.language.locale === 'en-us' );

        if ( thumbnail ) {
          updateVideoUnit( {
            variables: {
              data: buildThumbnailTree( thumbnail ),
              where: {
                id: unit.id
              }
            }
          } ).catch( err => console.dir( err ) );
        }
      } );
    }
  };

  const handleSaveDraft = async ( id, projectTitle ) => {
    const { updateVideoProject, data: { imageUses } } = props;
    const data = buildUpdateVideoProjectTree( filesToUpload, imageUses[0].id, projectTitle );

    const res = await updateVideoProject( {
      variables: {
        data,
        where: {
          id
        }
      }
    } ).catch( err => console.dir( err ) );

    connectUnitThumbnails( res );
  };


  const handleUploadProgress = async ( progressEvent, file ) => {
    props.uploadProgress( file.id, progressEvent );
  };

  const handleDisplayUploadSuccessMsg = () => {
    if ( mounted ) {
      setDisplayTheUploadSuccessMsg( false );
    }
    uploadSuccessTimer = null;
  };

  const handleDisplaySaveMsg = () => {
    if ( mounted ) {
      updateNotification( '' );
    }
    saveMsgTimer = null;
  };


  const handleUploadComplete = () => {
    const { setIsUploading, uploadReset } = props;

    setIsUploading( false );
    uploadReset(); // reset upload redux store
    setDisplayTheUploadSuccessMsg( true );
    updateNotification( 'Project saved as draft' );
    delayUnmount( handleDisplaySaveMsg, saveMsgTimer, SAVE_MSG_DELAY );
    delayUnmount( handleDisplayUploadSuccessMsg, uploadSuccessTimer, UPLOAD_SUCCESS_MSG_DELAY );
  };


  const isVideo = fileType => fileType.includes( 'video' );
  const isImage = fileType => fileType.includes( 'image' );

  const handleUpload = async project => {
    const { id, projectTitle } = project;
    const { getSignedS3Url, getFileInfo, setIsUploading } = props;

    // 1. set project id to newly created project (what if exsiting project?)
    setProjectId( id );

    // 2. If there are files to upload, upload them
    //    as upload(s) complete, we update the file object as it gets passed
    //    to the method that saves to the db
    if ( filesToUpload && filesToUpload.length ) {
      setIsUploading( true );

      await Promise.all( filesToUpload.map( async file => {
        let result = await uploadToS3( id, file, getSignedS3Url, handleUploadProgress );
        file.s3Path = result.path;
        file.contentType = result.contentType;

        // if video, upload to vimeo
        if ( isVideo( file.contentType ) ) {
          file.stream = {};
          file.stream.vimeo = await uploadToVimeo( file );
        }

        // if video or image, fetch file metadata (this call takes a bit long so may need to fix)
        if ( isVideo( file.contentType ) || isImage( file.contentType ) ) {
          result = await getFileMetadata( getFileInfo, file.s3Path );
          if ( result ) {
            const {
              duration, bitrate, width, height
            } = result;
            file.duration = duration;
            file.bitrate = bitrate;
            file.width = width;
            file.height = height;
          }
        }
      } ) );


      // 3. once all files have been uploaded, create and save new project (only new)
      handleSaveDraft( id, projectTitle );

      // 4. clean up upload process
      handleUploadComplete();

      // 5. update url to reflect a new project (only new)
      addProjectIdToUrl( id );
    }
  };

  const renderConfirm = ( isOpen, onConfirm, onCancel ) => (
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
  );

  const contentStyle = {
    border: `3px solid ${( projectId ) ? 'transparent' : '#02bfe7'}`
  };

  const { showNotification, notificationMessage } = notification;

  return (
    <div className="edit-project">
      { /* action buttons at top need to be separate component */ }
      <div className="edit-project__header">
        <ProjectHeader icon="video camera" text="Project Details">

          <Button
            className="edit-project__btn--delete"
            content="Delete Project"
            basic
            onClick={ () => setDeleteConfirmOpen( true ) }
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
            onCancel={ () => setDeleteConfirmOpen( false ) }
            onConfirm={ handleDeleteConfirm }
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
                onClick={ handleSaveDraft }
                disabled={ !projectId }
              />
            ) }
          <Button
            className="edit-project__btn--final-review"
            content="Final Review"
            onClick={ handleFinalReview }
            disabled={ !projectId }
          />
        </ProjectHeader>
      </div>

      { /* status notification need to be separate component */ }
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

        { isUploading
          && (
          <FileUploadProgressBar
            filesToUpload={ filesToUpload }
            showMessage
          />
          ) }
      </div>

      <div className="edit-project__content" style={ contentStyle }>
        <VideoProjectDataForm
          id={ projectId }
          updateNotification={ updateNotification }
          handleUpload={ handleUpload }
          maxCategories={ MAX_CATEGORY_COUNT }
        />
      </div>

      <div className="edit-project__status beta">
        { !projectId && <FormInstructions /> }
        { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

        { isUploading
          && (
          <FileUploadProgressBar
            filesToUpload={ filesToUpload }
            showMessage
          />
          ) }
      </div>

      { /* support files */ }
      <div className="edit-project__support-files">
        <UploadContext.Provider value={ isUploading }>
          <ProjectSupportFiles
            heading="Support Files"
            projectId={ projectId }
            config={ config.supportFiles }
          />
        </UploadContext.Provider>
      </div>

      <div className="edit-project__items">
        { /* project thumbnails */ }
        <UploadContext.Provider value={ isUploading }>
          <ProjectUnitItems
            projectId={ projectId }
            heading="Videos in Project"
            extensions={ ['.mov', '.mp4'] }
          />
        </UploadContext.Provider>

        { /* Add more files button */ }
        { projectId && (
        <div style={ { marginTop: '3rem' } }>
          <Button
            className="edit-project__add-more"
            content="+ Add more files to this project"
            basic
            onClick={ handleAddMoreFiles }
          />
          <VisuallyHidden>
            <label htmlFor="upload-item--multiple">upload more project items</label>
            <input
              id="upload-item--multiple"
              ref={ handleAddMoreRef }
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
};


VideoEdit.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  mutate: PropTypes.func,
  getSignedS3Url: PropTypes.func,
  getFileInfo: PropTypes.func,
  updateVideoProject: PropTypes.func,
  updateVideoUnit: PropTypes.func,
  router: PropTypes.object,
  setIsUploading: PropTypes.func, // from redux
  uploadReset: PropTypes.func, // from redux
  uploadProgress: PropTypes.func, // from redux
  upload: PropTypes.object // from redux
};

const mapStateToProps = state => ( {
  upload: state.upload
} );


const refetchVideoProject = result => {
  // This intermittently throws an error due to a null result
  // null result results in returning a null query
  // console.dir( result );

  // rerun sub queries, form, units, supportfiles
  try {
    const { data } = result;
    const node = data.updateVideoProject || data.updateVideoUnit;

    return ( [{
      query: VIDEO_PROJECT_FILES_QUERY,
      variables: { id: node.id },
    },
    {
      query: VIDEO_PROJECT_UNITS_QUERY,
      variables: { id: node.id },
    }
    ] );
  } catch ( err ) {
    console.log( err );
  }
};

export default compose(
  withRouter,
  connect( mapStateToProps, actions ),
  graphql( SIGNED_S3_URL_MUTATION, { name: 'getSignedS3Url' } ),
  graphql( FILE_INFO_MUTATION, { name: 'getFileInfo' } ),
  graphql( IMAGE_USES_QUERY ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, {
    name: 'updateVideoProject',
    options: () => ( {
      refetchQueries: result => refetchVideoProject( result )
    } )
  } ),
  graphql( DELETE_VIDEO_PROJECT_MUTATION ),
  graphql( UPDATE_VIDEO_UNIT_MUTATION, {
    name: 'updateVideoUnit',
    options: () => ( {
      refetchQueries: result => refetchVideoProject( result )
    } )
  } )
)( VideoEdit );


export { DELETE_VIDEO_PROJECT_MUTATION };
