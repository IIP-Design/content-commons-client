/**
 *
 * VideoEdit
 *
 */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Button, Confirm } from 'semantic-ui-react';

import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/upload';

import { buildUpdateVideoProjectTree } from 'lib/graphql/builders/video';
import { buildThumbnailTree } from 'lib/graphql/builders/common';
import {
  UPDATE_VIDEO_PROJECT_MUTATION,
  DELETE_VIDEO_PROJECT_MUTATION,
  UPDATE_VIDEO_UNIT_MUTATION,
  VIDEO_PROJECT_FILES_QUERY,
  VIDEO_PROJECT_UNITS_QUERY,
  VIDEO_PROJECT_QUERY
} from 'lib/graphql/queries/video';
import { IMAGE_USES_QUERY } from 'lib/graphql/queries/common';
import ApolloError from 'components/errors/ApolloError';
import Notification from 'components/Notification/Notification';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import ProjectUnits from 'components/admin/ProjectEdit/ProjectUnits/ProjectUnits';
import FormInstructions from 'components/admin/ProjectEdit/FormInstructions/FormInstructions';
import VideoProjectDetailsForm from 'components/admin/ProjectDetailsForm/VideoProjectDetailsForm/VideoProjectDetailsForm';
import VideoProjectSupportFiles from 'components/admin/ProjectSupportFiles/VideoProjectSupportFiles/VideoProjectSupportFiles';
import UploadSuccessMsg from 'components/admin/ProjectEdit/UploadSuccessMsg/UploadSuccessMsg';
import FileUploadProgressBar from 'components/admin/ProjectEdit/FileUploadProgressBar/FileUploadProgressBar';
import withFileUpload from 'hocs/withFileUpload/withFileUpload';
import './VideoEdit.scss';

export const UploadContext = React.createContext( false );

const VideoEdit = props => {
  const { setIsUploading } = props;

  const MAX_CATEGORY_COUNT = 2;
  const SAVE_MSG_DELAY = 2000;
  const UPLOAD_SUCCESS_MSG_DELAY = SAVE_MSG_DELAY + 1000;

  let uploadSuccessTimer = null;
  let saveMsgTimer = null;

  const [mounted, setMounted] = useState( false );
  const [error, setError] = useState( {} );
  const [projectId, setProjectId] = useState( props.id );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [displayTheUploadSuccessMsg, setDisplayTheUploadSuccessMsg] = useState( false );

  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false
  } );

  const [disableBtns, setDisableBtns] = useState( false );
  useEffect( () => {
    const { videoProjectUnitsQuery } = props;
    if ( videoProjectUnitsQuery ) {
      const { projectUnits } = videoProjectUnitsQuery;
      if ( projectUnits && projectUnits.units.length < 1 ) setDisableBtns( true );
    }
  }, [] );

  const centeredStyles = {
    position: 'absolute',
    top: '9em',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  const uploadVideoFileNotificationStyles = {
    display: 'block',
    fontSize: '1em',
    textAlign: 'center',
    backgroundColor: '#cd2026',
    color: 'white',
    opacity: 0
  };

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
  };

  const deleteProjectEnabled = () => {
    const { videoProjectQuery } = props;
    // disable delete project button if either there is no project id OR project has been published
    return !projectId || ( videoProjectQuery && videoProjectQuery.project && videoProjectQuery.project.status !== 'DRAFT' );
  };

  const delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  };

  const handleExit = () => {
    props.router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = async () => {
    const { deleteVideoProject } = props;

    const deletedProjectId = await deleteVideoProject( { variables: { id: projectId } } )
      .catch( err => { setError( err ); } );

    if ( deletedProjectId ) {
      handleExit();
    }
  };

  // const handleDeleteCancel = () => {
  //   setDeleteConfirmOpen( false );
  // };

  const handleFinalReview = e => {
    // Prevent multiple clicks - multiple clicks resulted in project going into PUBLISHING status
    if ( !e.detail || e.detail === 1 ) e.target.disabled = true;
    props.router.push( {
      pathname: '/admin/project',
      query: {
        content: 'video',
        id: projectId
      }
    }, `/admin/project/video/${projectId}/review` );
  };

  // const handleAddMoreFiles = () => {
  //   console.log( 'Add more video files' );
  //   addMoreInputRef.click();
  // };

  // const handleAddMoreRef = c => {
  //   addMoreInputRef = c;
  // };

  const handleSaveDraft = async ( id, projectTitle, tags ) => {
    const { updateVideoProject, imageUsesQuery: { imageUses } } = props;
    const data = buildUpdateVideoProjectTree( filesToUpload, imageUses[0].id, projectTitle, tags );

    await updateVideoProject( {
      variables: {
        data,
        where: {
          id
        }
      }
    } ).catch( err => console.dir( err ) );
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
    // const { setIsUploading, uploadReset } = props;
    const { uploadReset } = props;

    setIsUploading( false );
    uploadReset(); // reset upload redux store
    setDisplayTheUploadSuccessMsg( true );
    updateNotification( 'Project saved as draft' );
    delayUnmount( handleDisplaySaveMsg, saveMsgTimer, SAVE_MSG_DELAY );
    delayUnmount( handleDisplayUploadSuccessMsg, uploadSuccessTimer, UPLOAD_SUCCESS_MSG_DELAY );
  };


  const handleUpload = async ( project, tags ) => {
    const { id, projectTitle } = project;
    const { uploadExecute, updateFile } = props;

    // If there are files to upload, upload them
    if ( filesToUpload && filesToUpload.length ) {
      setIsUploading( true );

      // 1. Upload files to S3 & Vimeo and fetch file meta data
      await uploadExecute( id, filesToUpload, handleUploadProgress, updateFile );

      // 2. once all files have been uploaded, create and save new project (only new)
      handleSaveDraft( id, projectTitle, tags );

      // 3. clean up upload process
      handleUploadComplete();

      // 4. set project id to newly created project (what if exsiting project?)
      setProjectId( id );

      // 5. update url to reflect a new project (only new)
      addProjectIdToUrl( id );
    }
  };

  // const renderConfirm = ( isOpen, onConfirm, onCancel ) => (
  //   <Fragment>
  //     <Confirm
  //       className="confirm-modal"
  //       open={ isOpen }
  //       onCancel={ onCancel }
  //       onConfirm={ onConfirm }
  //       cancelButton="No"
  //       confirmButton="Yes"
  //       content={ (
  //         <ConfirmModalContent
  //           className="content"
  //           headline="Unsaved Changes!"
  //         >
  //           <p>You have not finished entering and uploading your project data and content.</p>
  //           <p>Navigating away from this page now, your changes will not be saved and uploads for this project will be canceled.</p>
  //           <p><strong>Do you want to leave this page and lose your changes and cancel your uploads?</strong></p>
  //         </ConfirmModalContent>
  //       ) }
  //     />
  //   </Fragment>
  // );

  const contentStyle = {
    border: `3px solid ${( projectId ) ? 'transparent' : '#02bfe7'}`
  };

  const { showNotification, notificationMessage } = notification;

  return (
    <div className="edit-project">
      { /* action buttons at top NEED TO BE MOVED to separate component */ }
      <div className="edit-project__header">
        <ProjectHeader icon="video camera" text="Project Details">
          <Button
            className="edit-project__btn--delete"
            content="Delete Project"
            basic
            onClick={ () => setDeleteConfirmOpen( true ) }
            disabled={ deleteProjectEnabled() }
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

          <Button
            className="edit-project__btn--save-draft"
            content="Save & Exit"
            basic
            onClick={ handleExit }
            disabled={ !projectId || disableBtns }
          />

          <Button
            className="edit-project__btn--final-review"
            content="Final Review"
            onClick={ handleFinalReview }
            disabled={ !projectId || disableBtns }
          />
        </ProjectHeader>
      </div>

      <div style={ centeredStyles }>
        <ApolloError error={ error } />
      </div>

      { /* Form data saved notification */ }
      <Notification
        el="p"
        customStyles={ centeredStyles }
        show={ showNotification }
        msg={ notificationMessage }
      />

      { /* Video file notification */ }
      { !isUploading && disableBtns && (
        <Notification
          el="p"
          classes="includeVideoFileNotification"
          customStyles={ uploadVideoFileNotificationStyles }
          msg="Please include a Video file to your project."
        />
      ) }

      { /* upload progress  */ }
      <div className="edit-project__status alpha">
        { !projectId && !isUploading && <FormInstructions /> }
        { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

        { isUploading
          && (
          <FileUploadProgressBar
            filesToUpload={ filesToUpload }
            label="Please keep this page open until upload is complete"
            fileProgessMessage
          />
          ) }
      </div>

      { /* project details form */ }
      <div className="edit-project__content" style={ contentStyle }>
        <VideoProjectDetailsForm
          id={ projectId }
          updateNotification={ updateNotification }
          handleUpload={ handleUpload }
          maxCategories={ MAX_CATEGORY_COUNT }
        />
      </div>

      { /* upload progress */ }
      <div className="edit-project__status beta">
        { !projectId && !isUploading && <FormInstructions /> }
        { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

        { isUploading
          && (
          <FileUploadProgressBar
            filesToUpload={ filesToUpload }
            label="Please keep this page open until upload is complete"
            fileProgessMessage
          />
          ) }
      </div>

      <UploadContext.Provider value={ isUploading }>
        { /* support files */ }
        <div className="edit-project__support-files">
          <VideoProjectSupportFiles
            projectId={ projectId }
            heading="Support Files"
          />
        </div>

        { /* project thumbnails */ }
        <div className="edit-project__items">
          <ProjectUnits
            projectId={ projectId }
            heading="Videos in Project"
            extensions={ ['.mov', '.mp4', '.avi'] }
          />
        </div>
      </UploadContext.Provider>
    </div>
  );
};


VideoEdit.propTypes = {
  id: PropTypes.string,
  imageUsesQuery: PropTypes.object,
  updateVideoProject: PropTypes.func,
  deleteVideoProject: PropTypes.func,
  videoProjectQuery: PropTypes.object,
  router: PropTypes.object,
  setIsUploading: PropTypes.func, // from redux
  uploadExecute: PropTypes.func, // from redux
  uploadReset: PropTypes.func, // from redux
  uploadProgress: PropTypes.func, // from redux
  updateFile: PropTypes.func,
  upload: PropTypes.object // from redux
};

const mapStateToProps = state => ( {
  upload: state.upload
} );

const connectUnitThumbnails = async ( props, result ) => {
  const { updateVideoProject: { units, thumbnails } } = result;
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

const refetchVideoProject = result => {
  // This intermittently throws an error due to a null result
  // null result results in returning a null query

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
  withFileUpload,
  connect( mapStateToProps, actions ),
  graphql( VIDEO_PROJECT_QUERY, { // this is not the best way to fetch project status, update after release
    name: 'videoProjectQuery',
    options: props => ( {
      variables: { id: props.id }
    } ),
    skip: props => !props.id
  } ),
  graphql( IMAGE_USES_QUERY, {
    name: 'imageUsesQuery'
  } ),
  graphql( VIDEO_PROJECT_UNITS_QUERY, {
    name: 'videoProjectUnitsQuery',
    options: props => ( {
      variables: { id: props.id }
    } ),
    skip: props => !props.id
  } ),
  graphql( DELETE_VIDEO_PROJECT_MUTATION, { name: 'deleteVideoProject' } ),
  graphql( UPDATE_VIDEO_UNIT_MUTATION, {
    name: 'updateVideoUnit',
    options: () => ( {
      refetchQueries: result => refetchVideoProject( result )
    } )
  } ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, {
    name: 'updateVideoProject',
    options: props => ( {
      refetchQueries: result => refetchVideoProject( result ),
      onCompleted: result => connectUnitThumbnails( props, result )
    } )
  } ),
)( VideoEdit );
