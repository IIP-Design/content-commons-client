import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import AddFilesSectionHeading from 'components/admin/ProjectEdit/GraphicEdit/AddFilesSectionHeading/AddFilesSectionHeading';
import ApolloError from 'components/errors/ApolloError';
import GraphicProjectDetailsFormContainer from 'components/admin/ProjectDetailsForm/GraphicProjectDetailsFormContainer/GraphicProjectDetailsFormContainer';
import GraphicProjectGraphicFiles from 'components/admin/ProjectEdit/GraphicEdit/GraphicProjectGraphicFiles/GraphicProjectGraphicFiles';
import GraphicProjectSupportFiles from 'components/admin/ProjectSupportFiles/GraphicProjectSupportFiles/GraphicProjectSupportFiles';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import UploadProgress from 'components/admin/ProjectEdit/UploadProgress/UploadProgress';
// import withFileUpload from 'hocs/withFileUpload/withFileUpload';
import { DELETE_GRAPHIC_PROJECT_MUTATION, GRAPHIC_PROJECT_QUERY } from 'lib/graphql/queries/graphic';
import './GraphicEdit.scss';

const GraphicEdit = props => {
  const router = useRouter();
  const MAX_CATEGORY_COUNT = 2;
  const SAVE_MSG_DELAY = 2000;
  const UPLOAD_SUCCESS_MSG_DELAY = SAVE_MSG_DELAY + 1000;

  let uploadSuccessTimer = null;
  let saveMsgTimer = null;

  const {
    loading, error: queryError, data
  } = useQuery( GRAPHIC_PROJECT_QUERY, {
    partialRefetch: true,
    variables: { id: props.id },
    displayName: 'GraphicProjectQuery',
    skip: !props.id
  } );
  const [deleteGraphicProject] = useMutation( DELETE_GRAPHIC_PROJECT_MUTATION );

  const [error, setError] = useState( {} );
  const [mounted, setMounted] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [displayTheUploadSuccessMsg, setDisplayTheUploadSuccessMsg] = useState( false );
  const [projectId, setProjectId] = useState( props.id );
  const [disableBtns, setDisableBtns] = useState( false );
  const [isFormValid, setIsFormValid] = useState( true );
  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false
  } );

  useEffect( () => {
    if ( data?.graphicProject ) {
      const { images } = data.graphicProject;

      if ( !images.length ) {
        setDisableBtns( true );
      }
    }
  }, [] );

  const updateNotification = msg => {
    setNotification( {
      notificationMessage: msg,
      showNotification: !!msg
    } );
  };

  const addProjectIdToUrl = id => {
    const path = `${router.asPath}&id=${id}`;

    router.replace( router.asPath, path, { shallow: true } );
  };

  const deleteProjectEnabled = () => (
    /**
     * disable delete project button if either there
     * is no project id OR project has been published
     */
    !projectId || ( data?.graphicProject && !!data.graphicProject.publishedAt )
  );

  const delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  };

  const handleAddFiles = () => {
    console.log( 'add files' );
  };

  const handleExit = () => {
    router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = async () => {
    const deletedProjectId = await deleteGraphicProject( {
      variables: { id: projectId }
    } ).catch( err => { setError( err ); } );

    if ( deletedProjectId ) {
      handleExit();
    }
  };

  const handlePublish = async () => {
    console.log( `publish project ${projectId}` );

    return null;
    // setPublishOperation( 'publish' );
    // executePublishOperation( projectId, publishProject );
  };

  const handlePublishChanges = async () => {
    console.log( `publishChanges for project ${projectId}` );

    return null;
    // setPublishOperation( 'publishChanges' );
    // executePublishOperation( projectId, publishProject );
  };

  const handleUnPublish = async () => {
    console.log( `unpublish project ${projectId}` );

    return null;
    // setPublishOperation( 'unpublish' );
    // executePublishOperation( projectId, unPublishProject );
  };

  const handleSaveDraft = async ( id, projectTitle, tags ) => {
    console.log( 'handleSaveDraft' );

    return null;
    // const dataObj = buildUpdateGraphicProjectTree( filesToUpload, imageUses[0].id, projectTitle, tags );

    // await updateGraphicProject( {
    //   variables: {
    //     data: dataObj,
    //     where: {
    //       id
    //     }
    //   }
    // } ).catch( err => console.dir( err ) );
  };

  const handleUploadProgress = async ( progressEvent, file ) => {
    console.log( 'handleUploadProgress' );
    // props.uploadProgress( file.id, progressEvent );
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
    console.log( 'handleUploadComplete' );
    // const { setIsUploading, uploadReset } = props;
    // const { uploadReset } = props;

    // setIsUploading( false );
    // uploadReset(); // reset upload redux store
    // setDisplayTheUploadSuccessMsg( true );
    // updateNotification( 'Project saved as draft' );
    // delayUnmount( handleDisplaySaveMsg, saveMsgTimer, SAVE_MSG_DELAY );
    // delayUnmount( handleDisplayUploadSuccessMsg, uploadSuccessTimer, UPLOAD_SUCCESS_MSG_DELAY );
  };

  const handleUpload = async ( project, tags ) => {
    console.log( 'handleUpload' );

    return null;
    // const { id, projectTitle } = project;
    // const { uploadExecute, updateFile } = props;

    // // If there are files to upload, upload them
    // if ( filesToUpload && filesToUpload.length ) {
    //   setIsUploading( true );

    //   // 1. Upload files to S3 & Vimeo and fetch file meta data
    //   await uploadExecute( id, filesToUpload, handleUploadProgress, updateFile );

    //   // 2. once all files have been uploaded, create and save new project (only new)
    //   handleSaveDraft( id, projectTitle, tags );

    //   // 3. clean up upload process
    //   handleUploadComplete();

    //   // 4. set project id to newly created project (what if exsiting project?)
    //   setProjectId( id );

    //   // 5. update url to reflect a new project (only new)
    //   addProjectIdToUrl( id );
  };

  const getSupportFiles = type => {
    if ( type === 'editable' ) {
      return data?.graphicProject?.supportFiles.filter( file => {
        const { filetype } = file;

        return filetype === 'image/vnd.adobe.photoshop';
      } ) || [];
    }

    return data?.graphicProject?.supportFiles.filter( file => {
      const { filetype } = file;

      return filetype !== 'image/vnd.adobe.photoshop';
    } ) || [];
  };

  const editableSupportFiles = getSupportFiles( 'editable' );
  const additionalSupportFiles = getSupportFiles( 'additional' );
  const graphicFiles = data?.graphicProject?.images || [];

  const centeredStyles = {
    position: 'absolute',
    top: '9em',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  if ( loading ) {
    return (
      <div
        style={ {
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
          content="Loading project details page..."
        />
      </div>
    );
  }

  if ( queryError ) {
    return (
      <div style={ centeredStyles }>
        <ApolloError error={ queryError } />
      </div>
    );
  }

  // if ( !data ) return null;

  const { showNotification, notificationMessage } = notification;
  const isUploading = false; // temp
  const filesToUpload = []; // temp
  // const { upload: { isUploading, filesToUpload } } = props;
  const contentStyle = {
    border: `3px solid ${projectId ? 'transparent' : '#02bfe7'}`
  };

  return (
    <div className="edit-graphic-project">
      <div className="header">
        <ProjectHeader icon="images outline" text="Project Details">
          <ActionButtons
            deleteConfirmOpen={ deleteConfirmOpen }
            setDeleteConfirmOpen={ setDeleteConfirmOpen }
            disabled={ {
              delete: deleteProjectEnabled(),
              save: !projectId || disableBtns || !isFormValid,
              preview: !projectId || disableBtns || !isFormValid,
              publish: !projectId || disableBtns || !isFormValid,
              publishChanges: !projectId || disableBtns || !isFormValid
            } }
            handle={ {
              deleteConfirm: handleDeleteConfirm,
              save: handleExit,
              publish: handlePublish,
              publishChanges: handlePublishChanges,
              unpublish: handleUnPublish
            } }
            show={ {
              delete: true,
              save: true,
              preview: true,
              publish: true, // temp
              unpublish: false // temp
            } }
            loading={ {
              publish: false, // temp
              publishChanges: false, // temp
              unpublish: false // temp
            } }
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

      { /* upload progress  */ }
      <UploadProgress
        className="alpha"
        projectId={ projectId }
        filesToUpload={ filesToUpload }
        displayTheUploadSuccessMsg={ displayTheUploadSuccessMsg }
        isUploading={ isUploading }
      />

      { /* project details form */ }
      <div className="content" style={ contentStyle }>
        <GraphicProjectDetailsFormContainer
          id={ projectId }
          data={ data }
          updateNotification={ updateNotification }
          handleUpload={ handleUpload }
          maxCategories={ MAX_CATEGORY_COUNT }
          setIsFormValid={ setIsFormValid }
        />
      </div>

      { /* upload progress */ }
      <UploadProgress
        className="beta"
        projectId={ projectId }
        filesToUpload={ filesToUpload }
        displayTheUploadSuccessMsg={ displayTheUploadSuccessMsg }
        isUploading={ isUploading }
      />

      <div className="graphic-support-files">
        <AddFilesSectionHeading
          projectId={ projectId }
          title="Support Files"
          acceptedFileTypes="image/*, font/*, application/postscript, application/pdf, application/rtf, text/plain, .docx, .doc"
          handleAddFiles={ handleAddFiles }
        />

        <div className="container">
          <GraphicProjectSupportFiles
            projectId={ projectId }
            headline="editable files"
            helperText="Original files that may be edited and adapted as needed for reuse."
            files={ editableSupportFiles }
            updateNotification={ updateNotification }
          />

          <div className="separator" />

          <GraphicProjectSupportFiles
            projectId={ projectId }
            headline="additional files"
            helperText="Additional files may include transcript files, style guides, or other support files needed by internal staff in order to properly use these graphics."
            files={ additionalSupportFiles }
            updateNotification={ updateNotification }
          />
        </div>
      </div>

      <div className="graphic-files">
        <AddFilesSectionHeading
          projectId={ projectId }
          title="Graphics in Project"
          acceptedFileTypes="image/*"
          handleAddFiles={ handleAddFiles }
        />

        <GraphicProjectGraphicFiles
          projectId={ projectId }
          files={ graphicFiles }
          updateNotification={ updateNotification }
        />
      </div>
    </div>
  );
};

GraphicEdit.propTypes = {
  id: PropTypes.string
};

export default GraphicEdit;
