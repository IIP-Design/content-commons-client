import React, { useEffect, useState, useReducer, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Button, Loader, Modal } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';

import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import ActionHeadline from 'components/admin/ActionHeadline/ActionHeadline';
import AddFilesSectionHeading from 'components/admin/ProjectEdit/GraphicEdit/AddFilesSectionHeading/AddFilesSectionHeading';
import AddGraphicFiles from 'components/admin/ProjectEdit/GraphicEdit/AddGraphicFiles/AddGraphicFiles';
import ApolloError from 'components/errors/ApolloError';
import GraphicProjectDetailsFormContainer from 'components/admin/ProjectDetailsForm/GraphicProjectDetailsFormContainer/GraphicProjectDetailsFormContainer';
import GraphicFilesFormContainer from 'components/admin/ProjectEdit/GraphicEdit/GraphicFilesFormContainer/GraphicFilesFormContainer';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import ButtonPublish from 'components/admin/ButtonPublish/ButtonPublish';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import SupportFiles from 'components/admin/ProjectEdit/GraphicEdit/SupportFiles/SupportFiles';
import UploadProgress from 'components/admin/ProjectEdit/UploadProgress/UploadProgress';

import { useFileUpload } from 'lib/hooks/useFileUpload';
import useIsDirty from 'lib/hooks/useIsDirty';
import usePublish from 'lib/hooks/usePublish';
import useTimeout from 'lib/hooks/useTimeout';
import useToggleModal from 'lib/hooks/useToggleModal';

import { buildImageFile, buildSupportFile } from 'lib/graphql/builders/common';
import {
  DELETE_GRAPHIC_PROJECT_MUTATION,
  UPDATE_GRAPHIC_PROJECT_MUTATION,
  GRAPHIC_PROJECT_QUERY,
  LOCAL_GRAPHIC_FILES,
  PUBLISH_GRAPHIC_PROJECT_MUTATION,
  UNPUBLISH_GRAPHIC_PROJECT_MUTATION,
  UPDATE_GRAPHIC_PROJECT_STATUS_MUTATION,
} from 'lib/graphql/queries/graphic';
import { GRAPHIC_STYLES_QUERY } from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';
import { LANGUAGE_BY_NAME_QUERY } from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';

import { getCount, getFileExt } from 'lib/utils';

import './GraphicEdit.scss';

const GraphicProject = dynamic( () => import( /* webpackChunkName: "graphicProject" */ 'components/GraphicProject/GraphicProject' ) );

/**
 * Tracks initial and added files
 * @param {object} state
 * @param {object} action
 */
const addFilesReducer = ( state, action ) => {
  switch ( action.type ) {
    case 'PROGRESS':
      return {
        ...state,
        isUploading: true,
        filesToAdd: state.filesToAdd.map( file => {
          if ( file.id === action.id ) {
            return { ...file, loaded: action.loaded };
          }

          return file;
        } ),
      };

    case 'PROGRESS_COMPLETE':
      return {
        ...state,
        isUploading: false,
      };

    case 'ADD':
      return {
        ...state,
        filesToAdd: action.filesToAdd,
      };

    case 'RESET':
      return {
        filesToAdd: [],
        isUploading: false,
      };

    default:
      return state;
  }
};

const GraphicEdit = ( { id } ) => {
  const [projectId, setProjectId] = useState( id );

  const router = useRouter();
  const MAX_CATEGORY_COUNT = 2;
  const SAVE_MSG_DELAY = 2000;
  const IMAGE_EXTS = [
    '.png', '.jpg', '.jpeg', '.gif',
  ];
  const EDITABLE_EXTS = [
    '.psd', '.ai', '.ae', '.eps',
  ];

  /**
    * TO DO: Local graphic query -- should probably add local props to
    * remote query instead of just writing straight to cache.
    * Would prevent the loading indicator that the remote query causes
    */
  const { data: localData, client } = useQuery( LOCAL_GRAPHIC_FILES );
  const localProjectId = useRef();

  /**
   * Reading graphic styles directly from cache can throw an
   * error: `Invariant Violation: Can't find field
   * graphicStyles on object { "localGraphicProject" }`. This
   * can occur if graphicStyles are not already in cache for
   * some reason. So get the styles with useQuery, which has a
   * default fetchPolicy of cache-first and won't throw the error.
   */
  const { data: stylesData } = useQuery( GRAPHIC_STYLES_QUERY );
  const { data: languageData } = useQuery( LANGUAGE_BY_NAME_QUERY, {
    variables: { displayName: 'English' },
  } );

  const {
    loading,
    error: queryError,
    data,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery(
    GRAPHIC_PROJECT_QUERY,
    {
      partialRefetch: true,
      variables: { id: projectId },
      displayName: 'GraphicProjectQuery',
      skip: !projectId,
    },
  );

  const [deleteGraphicProject] = useMutation( DELETE_GRAPHIC_PROJECT_MUTATION );
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );
  const [publishGraphicProject] = useMutation( PUBLISH_GRAPHIC_PROJECT_MUTATION );
  const [unpublishGraphicProject] = useMutation( UNPUBLISH_GRAPHIC_PROJECT_MUTATION );
  const [updateGraphicProjectStatus] = useMutation( UPDATE_GRAPHIC_PROJECT_STATUS_MUTATION );

  // publishOperation tells the action buttons which operation is executing so that it can
  // set its loading indicator on the right button
  const [publishOperation, setPublishOperation] = useState( '' );
  const [error, setError] = useState( {} );
  const [mounted, setMounted] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [disableBtns, setDisableBtns] = useState( false );
  const [isFormValid, setIsFormValid] = useState( true );
  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false,
  } );


  const { modalOpen, handleOpenModel, handleCloseModal } = useToggleModal();

  const {
    publishing,
    // publishError,
    executePublishOperation,
    handleStatusChange,
  } = usePublish(
    startPolling,
    stopPolling,
    updateGraphicProjectStatus,
    data,
  );

  const [state, dispatch] = useReducer( addFilesReducer, {
    filesToAdd: localData?.localGraphicProject?.files,
    isUploading: false,
  } );

  const updateNotification = msg => {
    setNotification( {
      notificationMessage: msg,
      showNotification: !!msg,
    } );
  };

  /**
   * Utility method to execute update mutation
   * @param {string} pId project id
   * @param {object} _data data to save
   */
  const updateProject = async ( pId, _data ) => updateGraphicProject( {
    variables: {
      data: _data,
      where: {
        id: pId,
      },
    },
  } ).catch( err => console.dir( err ) );

  /**
   * Adds project id to url to ensure proper display
   * on page refresh
   */
  const addProjectIdToUrl = useCallback(
    pId => {
      // Don't add id if it is aleady present
      const path = router.asPath.includes( '&id=' ) ? router.asPath : `${router.asPath}&id=${pId}`;

      router.replace( router.asPath, path, { shallow: true } );
    },
    [router],
  );

  /**
   * Clears local data cache
   */
  const clearLocalGraphicFiles = useCallback( () => {
    client.writeData( {
      data: {
        localGraphicProject: null,
      },
    } );
  }, [client] );

  const { startTimeout } = useTimeout( () => {
    if ( mounted ) {
      /**
       * After upload/save set project id which will trigger a re render
       * and populate data.graphicProject object. Project id was stored
       * via ref
       */
      const pId = localProjectId.current;

      updateNotification( '' );
      setProjectId( pId );
      addProjectIdToUrl( pId );
      clearLocalGraphicFiles();
    }
  }, SAVE_MSG_DELAY );

  const { uploadFile } = useFileUpload();

  useEffect( () => {
    setMounted( true );

    if ( data?.graphicProject ) {
      const { images } = data.graphicProject;

      if ( !images.length ) {
        setDisableBtns( true );
      }
    }

    return () => {
      clearLocalGraphicFiles();
      setMounted( false );
    };
  }, [data, clearLocalGraphicFiles] );

  // Check for changes since last publish
  const isDirty = useIsDirty( data?.graphicProject );

  useEffect( () => {
    if ( data?.graphicProject ) {
      // To do : move to usePublish func
      handleStatusChange( data.graphicProject );
    }
  }, [data] );


  const getStyleId = name => {
    const styles = stylesData?.graphicStyles;
    const styleObj = styles && styles.find( style => style.name === name );

    return styleObj?.id || '';
  };

  const deleteProjectEnabled = () => {
    /**
     * disable delete project button if either there
     * is no localData OR project has been published
     */
    const isPublished = data?.graphicProject && !!data.graphicProject.publishedAt;
    const hasNoLocalData = !projectId && localData?.localGraphicProject === null;

    return hasNoLocalData || isPublished;
  };

  const saveGraphicFile = async ( pId, file ) => updateProject( pId, {
    images: {
      create: buildImageFile( file ),
    },
  } );

  /**
   * Save support file
   * @param {string} pId project id
   * @param {object} file file to save
   * @return <Promise>
   */
  const saveSupportFile = async ( pId, file ) => {
    const _file = { ...file };
    const fileExt = getFileExt( file.input.name );

    _file.name = file.name;
    _file.language = languageData.languages[0].id;

    const exts = [...EDITABLE_EXTS, ...IMAGE_EXTS];

    // Mark image files added via Support as editable
    if ( exts.includes( fileExt ) ) {
      _file.visibility = 'INTERNAL';
      _file.editable = true;
    }

    return updateProject( projectId, {
      supportFiles: {
        create: buildSupportFile( _file ),
      },
    } );
  };

  const handleExit = () => {
    router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = async () => {
    const deletedProjectId = await deleteGraphicProject( {
      variables: { id: projectId },
    } ).catch( err => { setError( err ); } );

    if ( deletedProjectId ) {
      handleExit();
    }
  };

  const handlePublish = async () => {
    setPublishOperation( 'publish' );
    executePublishOperation( projectId, publishGraphicProject );
  };

  const handlePublishChanges = async () => {
    setPublishOperation( 'publishChanges' );
    executePublishOperation( projectId, publishGraphicProject );
  };

  const handleUnPublish = async () => {
    setPublishOperation( 'unpublish' );
    executePublishOperation( projectId, unpublishGraphicProject );
  };

  /**
   * Tracks upload progress of each file
   * @param {object} e ProgressEvent obj
   * @param {object} file file being tracked
   */
  const handleUploadProgress = async ( e, file ) => {
    dispatch( { type: 'PROGRESS', id: file.id, loaded: e.loaded } );
  };

  /**
   * Executes clean up functions after all
   * initial files have been uploaded and saved
   * Starts timer to display upload success message
   */
  const handleUploadComplete = () => {
    dispatch( { type: 'PROGRESS_COMPLETE' } );
    updateNotification( 'Project saved as draft' );
    startTimeout();
  };

  /**
   * Uploads and saves files. If error occurs, set 'error' prop on file object
   * @param {string} pId project id
   * @param {array} files files to save
   * @param {string} savePath path to S3 directory to save
   * @param {func} saveFn save function
   * @param {func} progress progress callback function
   * @return <Promise>
   */
  const uploadAndSaveFiles = ( pId, files, savePath, saveFn, progress ) => Promise.all(
    files.map( async file => {
      const _file = await uploadFile( savePath, file, progress );

      if ( _file.error ) {
        return Promise.resolve( { ...file, error: true } );
      }

      return saveFn( pId, _file );
    } ),
  );

  const handleOpenAddGraphicFilesModal = e => {
    dispatch( { type: 'ADD', filesToAdd: Array.from( e.target.files ) } );
    handleOpenModel();
  };

  const saveGraphicFiles = async files => {
    const { graphicProject } = data;

    handleCloseModal();

    updateNotification( 'Saving files...' );

    await uploadAndSaveFiles(
      projectId,
      files,
      graphicProject.assetPath,
      saveGraphicFile,
    );

    updateNotification( '' );
    // clear state
    dispatch( { type: 'RESET' } );

    /**
     * TO Do - alert if any files failed to upload/save
     * will return with error prop set to true
     * console.dir( filesSaved );
     */
  };

  /**
   * Saves support files. Executed 'Add Files' is clicked
   * and files are selected
   * @param {object} e Event object
   */
  const handleAddSupportFiles = async e => {
    updateNotification( 'Saving files...' );
    const { graphicProject } = data;
    const files = Array.from( e.target.files ).map( file => ( { input: file } ) );

    await uploadAndSaveFiles(
      projectId,
      files,
      graphicProject.assetPath,
      saveSupportFile,
    );

    refetch(); // update support files display
    updateNotification( '' );

    /**
     * TO Do - alert if any files failed to upload/save
     * will return with error prop set to true
     * console.dir( filesSaved );
     */
  };


  /**
   * Initial file save
   * @param {*} pId  project id
   * @param {*} file file to save
   * @return <Promise>
   */
  const handleIntialSave = async ( pId, file ) => {
    const fileExt = getFileExt( file.input.name );
    const isClean = file.style === getStyleId( 'Clean' );

    if ( EDITABLE_EXTS.includes( fileExt ) || isClean ) {
      file.visibility = 'INTERNAL';
      file.editable = true;
    }

    let _data;

    if ( IMAGE_EXTS.includes( getFileExt( file.input.name ) ) && !isClean ) {
      _data = {
        images: {
          create: buildImageFile( file ),
        },
      };
    } else {
      _data = {
        supportFiles: {
          create: buildSupportFile( { ...file, language: languageData.languages[0].id } ),
        },
      };
    }

    return updateProject( pId, _data );
  };

  /**
   * Called from Start upload and save process. Call cleanup
   * functions on completion
   * @param {object} initial project
   */
  const handleUpload = async project => {
    // store project id for use in cleanup
    localProjectId.current = project.id;
    updateNotification( 'Saving project...' );

    await uploadAndSaveFiles(
      project.id,
      state.filesToAdd,
      project.assetPath,
      handleIntialSave,
      handleUploadProgress,
    );

    handleUploadComplete( project.id );

    /**
     * TO Do - alert if any files failed to upload/save
     * will return with error prop set to true
     * console.dir( filesSaved );
     */
  };


  const getIsShell = filename => {
    const shellExtensions = [
      '.jpg', '.jpeg', '.png',
    ];
    const extension = getFileExt( filename );
    const isShellExtension = shellExtensions.includes( extension );
    const hasCleanInName = filename.toLowerCase().includes( 'clean' );
    const hasShellInName = filename.toLowerCase().includes( 'shell' );

    return isShellExtension && ( hasShellInName || hasCleanInName );
  };

  const getLocalFiles = type => {
    const localSupportFiles = [];
    const localGraphicFiles = [];

    if ( localData?.localGraphicProject?.files ) {
      localData.localGraphicProject.files.forEach( file => {
        const isClean = file.style === getStyleId( 'Clean' );
        const isCleanShell = isClean && getIsShell( file.name );
        const hasStyleAndSocial = getCount( file.style ) && getCount( file.social );

        if ( hasStyleAndSocial && !isCleanShell ) {
          localGraphicFiles.push( file );
        } else {
          localSupportFiles.push( file );
        }
      } );
    }

    return type === 'images' ? localGraphicFiles : localSupportFiles;
  };

  const getFiles = type => {
    const existingFiles = data?.graphicProject?.[type] || [];
    const localFiles = getLocalFiles( type );
    const files = projectId
      ? existingFiles
      : sortBy( localFiles, file => file.name.toLowerCase() );

    return files;
  };

  const getIsEditable = file => {
    let isEditable;

    if ( projectId ) {
      isEditable = file?.editable || false;
    } else {
      const extension = getFileExt( file.name );
      const hasEditableExt = EDITABLE_EXTS.includes( extension );
      const isShell = getIsShell( file.name );

      isEditable = isShell || hasEditableExt;
    }

    return isEditable;
  };

  const getSupportFiles = type => {
    const editableFiles = [];
    const additionalFiles = [];
    const supportFiles = getFiles( 'supportFiles' );

    if ( getCount( supportFiles ) ) {
      supportFiles.forEach( file => {
        if ( getIsEditable( file ) ) {
          editableFiles.push( file );
        } else {
          additionalFiles.push( file );
        }
      } );
    }

    return type === 'editable' ? editableFiles : additionalFiles;
  };

  const getPreview = () => (
    <GraphicProject
      item={ data?.graphicProject || {} }
      displayAsModal
      isAdminPreview
      useGraphQl
    />
  );

  const graphicImageFiles = getFiles( 'images' );

  const supportFilesConfig = [
    {
      headline: 'editable files',
      helperText: 'Original files that may be edited and adapted as needed for reuse.',
      files: getSupportFiles( 'editable' ),
    },
    {
      headline: 'additional files',
      helperText: 'Additional files may include transcript files, style guides, or other support files needed by internal staff in order to properly use these graphics.',
      files: getSupportFiles( 'additional' ),
    },
  ];

  const centeredStyles = {
    position: 'absolute',
    top: '1em',
    left: '50%',
    transform: 'translateX(-50%)',
  };

  const contentStyle = {
    border: `3px solid ${projectId ? 'transparent' : '#02bfe7'}`,
  };

  /**
   * Do not show loading if this is an initial
   * remote graphicProject fetch as it clears the
   * screen.  This happens when going from local data
   * to remote date. Add local resolver to remote resolver
   * to avoid this going forward.
   */
  if ( loading && !localProjectId.current ) {
    return (
      <div
        style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
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

  return (
    <div className="edit-graphic-project">
      <div className="header">
        <ProjectHeader icon="images outline" text="Project Details">
          <ActionButtons
            deleteConfirmOpen={ deleteConfirmOpen }
            setDeleteConfirmOpen={ setDeleteConfirmOpen }
            previewNode={ getPreview() }
            disabled={ {
              'delete': !!deleteProjectEnabled(),
              save: !projectId || disableBtns || !isFormValid,
              preview: !projectId || disableBtns || !isFormValid,
              publish: !projectId || disableBtns || !isFormValid, // having graphics required?
              publishChanges: !projectId || disableBtns || !isFormValid,
            } }
            handle={ {
              deleteConfirm: projectId ? handleDeleteConfirm : handleExit,
              save: handleExit,
              publish: handlePublish,
              publishChanges: handlePublishChanges,
              unpublish: handleUnPublish,
            } }
            show={ {
              'delete': true,
              save: true,
              preview: true,
              publish: data?.graphicProject?.status === 'DRAFT',
              publishChanges: data?.graphicProject?.publishedAt && isDirty,
              unpublish: data?.graphicProject?.status === 'PUBLISHED',
            } }
            loading={ {
              publish: publishing && publishOperation === 'publish',
              publishChanges: publishing && publishOperation === 'publishChanges',
              unpublish: publishing && publishOperation === 'unpublish',
            } }
          />
        </ProjectHeader>
      </div>
      <div style={ centeredStyles }>
        <ApolloError error={ error } />
      </div>
      {/* Form data saved notification */}
      <Notification
        el="p"
        customStyles={ centeredStyles }
        show={ showNotification }
        msg={ notificationMessage }
      />

      {/* upload progress  */}
      <UploadProgress
        className="alpha"
        projectId={ projectId }
        filesToUpload={ state.filesToAdd }
        isUploading={ state.isUploading }
        uploadComplete={ handleUploadComplete }
      />

      {/* project details form */}
      <GraphicProjectDetailsFormContainer
        id={ projectId }
        contentStyle={ contentStyle }
        data={ data }
        updateNotification={ updateNotification }
        handleUpload={ handleUpload }
        maxCategories={ MAX_CATEGORY_COUNT }
        setIsFormValid={ setIsFormValid }
      />

      {/* upload progress */}
      <UploadProgress
        className="beta"
        projectId={ projectId }
        filesToUpload={ state.filesToAdd }
        isUploading={ state.isUploading }
      />

      {/* project support files */}
      <div className="support-files">
        <AddFilesSectionHeading
          projectId={ projectId }
          title="Support Files"
          acceptedFileTypes="image/*, image/vnd.adobe.photoshop, font/*, application/postscript, application/pdf, application/rtf, text/plain, .docx, .doc, .ttf"
          handleAddFiles={ handleAddSupportFiles }
        />

        <SupportFiles
          projectId={ projectId }
          updateNotification={ updateNotification }
          fileTypes={ supportFilesConfig }
        />
      </div>

      {/* project graphic files */}
      <div className="graphic-files">
        <AddFilesSectionHeading projectId={ projectId } title="Graphics in Project">
          <Modal
            open={ modalOpen }
            style={ { width: '820px' } }
            trigger={ (
              <ButtonAddFiles
                aria-label="Add files"
                multiple
                accept="image/gif, image/jpeg,image/jpg, image/png"
                onChange={ handleOpenAddGraphicFilesModal }
              >
                + Add Files
              </ButtonAddFiles>
            ) }
            content={ (
              <AddGraphicFiles
                files={ state.filesToAdd }
                closeModal={ handleCloseModal }
                save={ saveGraphicFiles }
              />
            ) }
          />
        </AddFilesSectionHeading>

        <GraphicFilesFormContainer
          projectId={ projectId }
          files={ graphicImageFiles }
          setIsFormValid={ setIsFormValid }
          updateNotification={ updateNotification }
        />
      </div>

      {/* bottom buttons */}
      { projectId && (
        <div className="actions">
          <ActionHeadline
            className="headline"
            type="graphic project"
            published={ data?.graphicProject?.status === 'PUBLISHED' }
            updated={ isDirty }
          />

          <Modal
            closeIcon
            trigger={ (
              <Button
                className="action-btn btn--preview"
                content="Preview"
                disabled={ !projectId || disableBtns || !isFormValid }
                primary
              />
            ) }
            content={ (
              <Modal.Content>
                { getPreview() }
              </Modal.Content>
            ) }
          />

          <ButtonPublish
            handlePublish={ handlePublish }
            handleUnPublish={ handleUnPublish }
            status={ data?.graphicProject?.status || 'DRAFT' }
            updated={ isDirty }
            disabled={ !projectId || disableBtns || !isFormValid }
          />
        </div>
      ) }
    </div>
  );
};

GraphicEdit.propTypes = {
  id: PropTypes.string,
};

export default GraphicEdit;
