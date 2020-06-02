import React, { useEffect, useState, useReducer, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import AddFilesSectionHeading from 'components/admin/ProjectEdit/GraphicEdit/AddFilesSectionHeading/AddFilesSectionHeading';
import ApolloError from 'components/errors/ApolloError';
import GraphicProjectDetailsFormContainer from 'components/admin/ProjectDetailsForm/GraphicProjectDetailsFormContainer/GraphicProjectDetailsFormContainer';
import GraphicFilesFormContainer from 'components/admin/ProjectEdit/GraphicEdit/GraphicFilesFormContainer/GraphicFilesFormContainer';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import SupportFiles from 'components/admin/ProjectEdit/GraphicEdit/SupportFiles/SupportFiles';
import UploadProgress from 'components/admin/ProjectEdit/UploadProgress/UploadProgress';
import { useFileUpload } from 'lib/hooks/useFileUpload';
import useTimeout from 'lib/hooks/useTimeout';
import {
  DELETE_GRAPHIC_PROJECT_MUTATION,
  UPDATE_GRAPHIC_PROJECT_MUTATION,
  GRAPHIC_PROJECT_QUERY,
  LOCAL_GRAPHIC_FILES,
} from 'lib/graphql/queries/graphic';
import { buildImageFile, buildSupportFile } from 'lib/graphql/builders/common';
import { GRAPHIC_STYLES_QUERY } from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';
import { LANGUAGE_BY_NAME_QUERY } from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import { getCount, getFileExt } from 'lib/utils';
import './GraphicEdit.scss';

const uploadProgessReducer = ( state, action ) => {
  switch ( action.type ) {
    case 'PROGRESS':
      return {
        ...state,
        filesToUpload: state.filesToUpload.map( file => {
          if ( file.id === action.id ) {
            return { ...file, loaded: action.loaded };
          }

          return file;
        } ),
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
    '.psd', '.ai', '.ae',
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

  const { loading, error: queryError, data } = useQuery( GRAPHIC_PROJECT_QUERY, {
    partialRefetch: true,
    variables: { id: projectId },
    displayName: 'GraphicProjectQuery',
    skip: !projectId,
  } );

  const [deleteGraphicProject] = useMutation( DELETE_GRAPHIC_PROJECT_MUTATION );
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );

  const [error, setError] = useState( {} );
  const [isUploading, setIsUploading] = useState( false );
  const [mounted, setMounted] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [disableBtns, setDisableBtns] = useState( false );
  const [isFormValid, setIsFormValid] = useState( true );
  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false,
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
   * on paghe referesg
   */
  const addProjectIdToUrl = useCallback(
    pId => {
      const path = `${router.asPath}&id=${pId}`;

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
       * and popluate data.graphicProject object. Project id was stored
       * via ref
       */
      const pId = localProjectId.current;

      updateNotification( '' );
      setProjectId( pId );
      addProjectIdToUrl( pId );
      clearLocalGraphicFiles();
    }
  }, SAVE_MSG_DELAY );

  const [state, dispatch] = useReducer( uploadProgessReducer, {
    filesToUpload: localData?.localGraphicProject?.files,
    complete: false,
  } );

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
  }, [clearLocalGraphicFiles, data] );


  const getStyleId = name => {
    const styles = stylesData?.graphicStyles;
    const styleObj = styles && styles.find( style => style.name === name );

    return styleObj?.id || '';
  };

  const deleteProjectEnabled = () => {
    /**
     * disable delete project button if either there
     * is no project id OR project has been published
     */
    const isPublished = data?.graphicProject && !!data.graphicProject.publishedAt;

    return !projectId || isPublished;
  };

  const saveGraphicFile = async ( pId, file ) => {
  };

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

    if ( EDITABLE_EXTS.includes( fileExt ) ) {
      _file.visibility = 'INTERNAL';
    }

    if ( IMAGE_EXTS.includes( fileExt ) ) {
      _file.style = getStyleId( 'Clean' );
      _file.visibility = 'INTERNAL';
    }

    return updateProject( projectId, {
      supportFiles: {
        create: buildSupportFile( _file ),
      },
    } );
  };

  const handleAddGraphicFiles = e => {
    console.log( 'handleAddGraphicFiles' );
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
   * initial files have been uplaoded and saved
   * Starts timeer to display upload success message
   */
  const handleUploadComplete = () => {
    setIsUploading( false );
    updateNotification( 'Project saved as draft' );
    startTimeout();
  };

  /**
   * UUploads and saves files. If error occurrs set 'error' prop on file object
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
        return Promise.resolve( { ..._file, error: true } );
      }

      return saveFn( pId, _file );
    } ),
  );

  /**
   * Saves support files. Executed 'Add Files' is clicked
   * and files are selected
   * @param {object} e Event object
   */
  const handleSaveSupportFiles = async e => {
    updateNotification( 'Saving files...' );
    const { graphicProject } = data;
    const files = Array.from( e.target.files ).map( file => ( { input: file } ) );

    const filesSaved = await uploadAndSaveFiles(
      projectId,
      files,
      graphicProject.assetPath,
      saveSupportFile,
    );

    updateNotification( '' );

    // alert if any files failed to upload/save
    console.dir( filesSaved );
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
    setIsUploading( true );

    const filesSaved = await uploadAndSaveFiles(
      project.id,
      state.filesToUpload,
      project.assetPath,
      handleIntialSave,
      handleUploadProgress,
    );

    handleUploadComplete( project.id );

    // alert if any files failed to upload/save
    // console.dir( filesSaved );
  };


  const getIsShell = filename => {
    const shellExtensions = [
      '.jpg', '.jpeg', '.png',
    ];
    const extension = getFileExt( filename );
    const isJpgOrPng = shellExtensions.includes( extension );
    const hasShellInName = filename.toLowerCase().includes( 'shell' );

    return isJpgOrPng && hasShellInName;
  };

  const getInitialFiles = type => {
    const initialSupportFiles = [];
    const initialGraphicFiles = [];

    if ( localData?.localGraphicProject?.files ) {
      localData.localGraphicProject.files.forEach( file => {
        const isClean = file.style === getStyleId( 'Clean' );
        const isCleanShell = isClean && getIsShell( file.name );
        const hasStyleAndSocial = getCount( file.style ) && getCount( file.social );

        if ( hasStyleAndSocial && !isCleanShell ) {
          initialGraphicFiles.push( file );
        } else {
          initialSupportFiles.push( file );
        }
      } );
    }

    return type === 'graphicFiles' ? initialGraphicFiles : initialSupportFiles;
  };

  const getSupportFiles = type => {
    const editableExtensions = [
      '.psd', '.ai', '.ae', '.eps',
    ];
    const editableFiles = [];
    const additionalFiles = [];

    const existingSupportFiles = data?.graphicProject?.supportFiles || [];
    const existingGraphicFiles = data?.graphicProject?.images || [];

    const shellFile = existingGraphicFiles.filter( img => getIsShell( img.filename ) );
    const existingFilesPlusShell = existingSupportFiles.concat( shellFile );

    const initialFiles = getInitialFiles( 'supportFiles' );
    const supportFiles = projectId ? existingFilesPlusShell : initialFiles;
    const sortedFiles = sortBy( supportFiles, file => {
      if ( projectId ) {
        return file.filename;
      }

      return file.name;
    } );

    if ( getCount( supportFiles ) ) {
      sortedFiles.forEach( file => {
        const _filename = projectId ? file.filename : file.name;
        const extension = getFileExt( _filename );

        const hasEditableExt = editableExtensions.includes( extension );
        const isShell = getIsShell( _filename );

        if ( hasEditableExt || isShell ) {
          editableFiles.push( file );
        } else {
          additionalFiles.push( file );
        }
      } );
    }

    return type === 'editable' ? editableFiles : additionalFiles;
  };

  const getGraphicFiles = () => {
    const existingFiles = data?.graphicProject?.images || [];
    const initialFiles = getInitialFiles( 'graphicFiles' );
    let files = [];

    if ( projectId ) {
      files = existingFiles.filter( img => !getIsShell( img.filename ) );
    } else {
      files = initialFiles;
    }

    return files;
  };

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

  if ( loading ) {
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

  const { showNotification, notificationMessage } = notification;
  const contentStyle = {
    border: `3px solid ${projectId ? 'transparent' : '#02bfe7'}`,
  };

  return (
    <div className="edit-graphic-project">
      <div className="header">
        <ProjectHeader icon="images outline" text="Project Details">
          <ActionButtons
            deleteConfirmOpen={ deleteConfirmOpen }
            setDeleteConfirmOpen={ setDeleteConfirmOpen }
            disabled={ {
              'delete': deleteProjectEnabled(),
              save: !projectId || disableBtns || !isFormValid,
              preview: !projectId || disableBtns || !isFormValid,
              publish: !projectId || disableBtns || !isFormValid,
              publishChanges: !projectId || disableBtns || !isFormValid,
            } }
            handle={ {
              deleteConfirm: handleDeleteConfirm,
              save: handleExit,
              publish: handlePublish,
              publishChanges: handlePublishChanges,
              unpublish: handleUnPublish,
            } }
            show={ {
              'delete': true,
              save: true,
              preview: true,
              publish: true, // temp
              unpublish: false, // temp
            } }
            loading={ {
              publish: false, // temp
              publishChanges: false, // temp
              unpublish: false, // temp
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
        filesToUpload={ state.filesToUpload }
        isUploading={ isUploading }
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
        startTimeout={ startTimeout }
      />

      {/* upload progress */}
      <UploadProgress
        className="beta"
        projectId={ projectId }
        filesToUpload={ state.filesToUpload }
        isUploading={ isUploading }
      />
      {/* project support files */}
      <div className="support-files">
        <AddFilesSectionHeading
          projectId={ projectId }
          title="Support Files"
          acceptedFileTypes="image/*, image/vnd.adobe.photoshop, font/*, application/postscript, application/pdf, application/rtf, text/plain, .docx, .doc"
          handleAddFiles={ handleSaveSupportFiles }
        />

        <SupportFiles
          projectId={ projectId }
          updateNotification={ updateNotification }
          fileTypes={ supportFilesConfig }
        />
      </div>
      {/* project graphic files */}
      <div className="graphic-files">
        <AddFilesSectionHeading
          projectId={ projectId }
          title="Graphics in Project"
          acceptedFileTypes="image/gif, image/jpeg, image/png"
          handleAddFiles={ handleAddGraphicFiles }
        />

        <GraphicFilesFormContainer
          projectId={ projectId }
          files={ getGraphicFiles() }
          setIsFormValid={ setIsFormValid }
          updateNotification={ updateNotification }
        />
      </div>
    </div>
  );
};

GraphicEdit.propTypes = {
  id: PropTypes.string,
};

export default GraphicEdit;
