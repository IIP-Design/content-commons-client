/**
 *
 * ProjectUnits
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/projectUpdate';
import { graphql } from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';
import { Card } from 'semantic-ui-react';
import { getFileExt } from 'lib/utils';
import isEmpty from 'lodash/isEmpty';
import withFileUpload from 'hocs/withFileUpload/withFileUpload';
import { searchTreeForS3FileDirectories } from 'lib/upload';
import { buildUnit, buildVideoFileTree } from 'lib/graphql/builders/video';
import { LANGUAGES_QUERY } from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import {
  VIDEO_PROJECT_QUERY,
  DELETE_VIDEO_FILE_MUTATION,
  UPDATE_VIDEO_FILE_MUTATION,
  UPDATE_VIDEO_UNIT_MUTATION,
  DELETE_MANY_VIDEO_UNITS_MUTATION,
  UPDATE_VIDEO_PROJECT_MUTATION,
} from 'lib/graphql/queries/video';


import EditProjectFiles from '../ProjectEdit/EditProjectFilesModal/EditProjectFilesModal';

import ProjectUnitItem from './ProjectUnitItem/ProjectUnitItem';
import './ProjectUnits.scss';


const ProjectUnits = props => {
  const {
    projectId,
    videoProject,
    filesToUpload,
    uploadExecute,
    updateVideoUnit,
    deleteManyVideoUnits,
    updateVideoProject,
    updateVideoFile,
    projectUpdated,
    heading,
    extensions,
  } = props;

  const [progress, setProgress] = useState( 0 );

  const hasProjectUnits = () => ( !isEmpty( videoProject ) && videoProject.project && videoProject.project.units );
  const hasFilesToUpload = () => ( filesToUpload && filesToUpload.length );

  const separateFilesByLanguage = files => {
    const languages = {};

    files.forEach( file => {
      if ( !languages[file.language] ) {
        languages[file.language] = [];
      }
      languages[file.language].push( file );
    } );

    return languages;
  };

  /**
   * Check to see if the file has changed by comparing file props
   * @param {*} unit unit containing files
   * @param {*} file file to check
   */
  const hasFileChanged = ( unit, file ) => {
    const propChanges = [];
    const found = unit.files.find( f => f.id === file.id );

    if ( found ) {
      if ( file.language !== found.language.id ) {
        propChanges.push( 'language' );
      }

      if ( file.quality !== found.quality ) {
        propChanges.push( 'quality' );
      }

      if ( file.use !== found.use.id ) {
        propChanges.push( 'use' );
      }

      if ( file.videoBurnedInStatus !== found.videoBurnedInStatus ) {
        propChanges.push( 'videoBurnedInStatus' );
      }
    }

    return propChanges;
  };

  /**
   * Only allows files to be uploaded that have the correct extension for this unit
   * @param {*} filesToVerify
   */
  const getAllowedExtensions = filesToVerify => filesToVerify.filter( file => extensions.includes( getFileExt( file.input.name ) ) );

  /**
   * Returns all nested files
   */
  const getFilesToEdit = () => {
    let filesToEdit = [];

    if ( hasProjectUnits() ) {
      videoProject.project.units.forEach( unit => {
        const unitFiles = ( unit && unit.files ) ? unit.files : [];

        filesToEdit = [...filesToEdit, ...unitFiles];
      } );
    }

    return filesToEdit;
  };

  /**
   * Compare files scheduled to be removed against current files in unit.
   * and if there will be no files left after removal add to removal array
   * @param {array} filesToRemove
   */
  const getUnitsToRemove = files => {
    const unitsToRemove = [];

    videoProject.project.units.forEach( u => {
      // if a unit does not have any files then remove
      const found = files.find( file => file.language === u.language.id );

      if ( !found ) {
        unitsToRemove.push( u );
      }
    } );

    return unitsToRemove;
  };

  /**
   * Separates files into units and normalizes data structure
   * for consistent rendering. New files have an 'input' prop
   * of type File. These come in via redux.
   */
  const getUnitsForNewProject = () => {
    // add this to unit state so titles update on upload
    const newUnits = {};

    const allowedFiles = getAllowedExtensions( filesToUpload );

    // 1. Separate files by language
    allowedFiles.forEach( file => {
      if ( !newUnits[file.language] ) {
        newUnits[file.language] = [];
      }
      newUnits[file.language].push( file );
    } );

    // 2. Normalize data structure for consistent ui rendering (same structure as graphql unit)
    const entries = Object.entries( newUnits );

    return entries.map( entry => {
      const [language, fileObjs] = entry;

      return ( {
        files: fileObjs, // spread may break connection
        language: {
          id: language,
          displayName: props.languageList.languages.find( l => l.id === language ).displayName,
        },
      } );
    } );
  };

  /**
   * Locates unit file belongs to
   * @param {*} file
   */
  const getFileUnit = file => {
    const len = videoProject.project.units.length;

    /* eslint-disable no-plusplus */
    for ( let i = 0; i < len; i++ ) {
      const unit = videoProject.project.units[i];
      const found = unit.files.find( f => f.id === file.id );

      if ( found ) {
        return unit;
      }
    }
  };

  /**
   * Convenience function to define query structure
   * @param {string} id project id
   * @param {object} updatedData updates to save
   */
  const getQuery = ( id, updatedData ) => ( {
    variables: {
      data: updatedData,
      where: {
        id,
      },
    },
  } );

  /**
  * We are assuming a single thumbnail per language although the data
  * model can support multiple thumbnails per language (in diff sizes)
  * todo: refactor to to support multiple thumbnails per language
  * @param {*} language language d of file
  */
  const getLanguageThumbnail = language => {
    const { project: { thumbnails } } = videoProject;
    const thumbnail = thumbnails.find( tn => tn.language.id === language );

    if ( thumbnail ) {
      return thumbnail;
    }

    // if thumbnail does not exist iin language, return english
    return thumbnails.find( tn => tn.language.displayName === 'English' );
  };

  const getTagIds = ( tags = [] ) => tags.map( tag => tag.id );

  const handleUploadProgress = ( progressEvent, file ) => {
    file.loaded = progressEvent.loaded;
    setProgress( progressEvent.loaded );
  };

  /**
   * If file language has changed, disconnect from current language
   * @param {object} unit unit file currently belongs to
   * @param {object} file
   */
  const disconnectFileFromUnit = async ( unit, file ) => updateVideoUnit( getQuery( unit.id, {
    files: {
      disconnect: { id: file.id },
    },
  } ) );

  /**
   * Updates file properties of existing file
   * @param {*} file
   */
  const updateFile = async file => updateVideoFile( getQuery( file.id, {
    language: {
      connect: {
        id: file.language,
      },
    },
    quality: file.quality,
    videoBurnedInStatus: file.videoBurnedInStatus,
    use: {
      connect: {
        id: file.use,
      },
    },
  } ) );


  /**
   * Removes any unit that does not have files
   * @param {array} unitsToRemove
   */
  const removeUnits = async unitsToRemove => {
    if ( unitsToRemove.length ) {
      const unitIds = unitsToRemove.map( u => u.id );

      try {
        const res = deleteManyVideoUnits( {
          variables: {
            where: {
              id_in: unitIds,
            },
          },
        } );

        return res;
      } catch ( err ) {
        console.log( err );
      }
    }
  };

  const uploadFiles = async ( files = [] ) => {
    let uploadDir = null;

    return Promise.all( files.map( async file => {
      // 1. verify allowed file extension
      if ( !extensions.includes( getFileExt( file.name ) ) ) {
        throw new Error( `File: ${file.name} does not have an accepted support extension for this project` );
      }

      try {
        // 2. get upload path from existing files if possible
        if ( hasProjectUnits() ) {
          uploadDir = searchTreeForS3FileDirectories( videoProject.project.units );
          uploadDir = uploadDir.length ? uploadDir[0] : '';
        }

        // if new file use projectId to create new dir on S3, else use existing dir
        const projectIdPath = uploadDir || projectId;

        // 3. Upload file
        return uploadExecute( projectIdPath, [file], handleUploadProgress );
      } catch ( err ) {
        file.error = !!err;
        console.error( err );
      }
    } ) );
  };

  const removeFiles = async files => {
    const { deleteVideoFile } = props;

    return Promise.all( files.map( async file => {
      const { project: { projectTitle } } = videoProject;

      deleteVideoFile( { variables: { id: file.id } } );
      updateVideoProject( getQuery( projectId, { projectTitle } ) );
    } ) );
  };

  /**
   * Executes the following tasks
   * 1. Separate files into language units
   * 2. Determine if unit exists or needs to be created
   * 3. Adds files to either be created or connected to applicable lang unit
   * @param {array} files files array containing all changes
   */
  const getCreateConnectUnits = files => {
    const { project } = videoProject;
    const filesByLanguage = separateFilesByLanguage( files );
    const entries = Object.entries( filesByLanguage );
    const unitCreate = {};
    const unitUpdate = {};


    entries.forEach( entry => {
      const [language, _files] = entry;
      const unitExistingLanguage = project.units.find( unit => unit.language.id === language );

      const create = [];
      const update = [];

      _files.forEach( async file => {
        if ( file.input ) { // only add if file was uploaded successfully
          create.push( file );
        } else {
          const unitFileBelongsTo = getFileUnit( file );

          if ( unitFileBelongsTo ) {
            const fileChanged = hasFileChanged( unitFileBelongsTo, file );

            if ( fileChanged.length ) {
              update.push( file );
              await updateFile( file );

              if ( fileChanged.includes( 'language' ) ) {
                await disconnectFileFromUnit( unitFileBelongsTo, file );
              }
            }
          }
        }
      } );

      if ( unitExistingLanguage ) {
        unitUpdate[unitExistingLanguage.id] = { create, update }; // unit exists, create and update (upsert)
      } else {
        unitCreate[language] = { create, update }; // create unit and create and connect
      }
    } );

    return { unitUpdate, unitCreate };
  };

  /**
   * Adds or connects files to applicable unit
   * @param {array} unitsToUpdate unit array to add or connect files
   */
  const updateUnits = async unitsToUpdate => Promise.all( unitsToUpdate.map( async entry => {
    const [unitId, operations] = entry;
    const { create, update } = operations;
    const _files = {};

    if ( create.length ) {
      _files.create = buildVideoFileTree( create );
    }
    if ( update.length ) {
      _files.connect = update.map( file => ( { id: file.id } ) );
    }
    if ( !isEmpty( _files ) ) {
      await updateVideoUnit( getQuery( unitId, { files: _files } ) );
    }
  } ) );

  /**
   * Creates unit and creates/connects files
   * @param {array} unitsToCreate unit to create
   */
  const createUnits = async unitsToCreate => Promise.all( unitsToCreate.map( async entry => {
    const [language, operations] = entry;
    const { create, update } = operations;

    const { project: { projectTitle, tags } } = videoProject;
    const thumbnail = getLanguageThumbnail( language );

    return updateVideoProject( getQuery( projectId, {
      units: {
        create: buildUnit( projectTitle, language, getTagIds( tags ), thumbnail, create, update ),
      },
    } ) );
  } ) );

  /**
   * Main save function
   * @param {array} files
   * @param {array} filesToRemove
   */
  const handleSave = async ( files, filesToRemove ) => {
    try {
      // remove files
      await removeFiles( filesToRemove );

      // upload files
      const toUpload = files.filter( file => ( file.input ) );

      await uploadFiles( toUpload ).catch( err => console.log( err ) );

      const filesUploadSuccess = files.filter( file => !file.error );

      // separate into units that need o be created and units that need to be updated
      const { unitUpdate, unitCreate } = getCreateConnectUnits( filesUploadSuccess );

      // update unit and create or connect files
      const unitsToUpdate = Object.entries( unitUpdate );

      await updateUnits( unitsToUpdate );

      // create unit and create or connect files
      const unitsToCreate = Object.entries( unitCreate );

      await createUnits( unitsToCreate );

      // remove units that have no connected files
      const unitsToRemove = getUnitsToRemove( filesUploadSuccess );

      await removeUnits( unitsToRemove );

      // Notify redux state that Project updated, indexed by project id
      // Used for conditionally displaying Publish buttons & msgs (bottom of screen) on VideoReview
      projectUpdated( projectId, true );

      // refresh cache to update component with new data
      return videoProject.refetch();
    } catch ( err ) {
      console.dir( err );
    }
  };

  const fetchUnits = () => {
    if ( hasProjectUnits() ) {
      return videoProject.project.units;
    }

    if ( hasFilesToUpload() ) {
      return getUnitsForNewProject();
    }

    return [];
  };

  const units = fetchUnits();
  const projectFiles = getFilesToEdit();
  const allowedFilesToUpload = getAllowedExtensions( filesToUpload );

  return (
    <div className="project-units">
      <h2 className="list-heading" style={ { marginBottom: '1rem' } }>
        { heading }
        { projectId
          && (
            <EditProjectFiles
              title="Edit video files in this project"
              type="video"
              filesToEdit={ projectFiles }
              extensions={ ['.mov', '.mp4'] }
              save={ handleSave }
              progress={ progress } // use here to re-render modal
            />
          ) }
      </h2>
      <Card.Group>
        { units.map( unit => (
          <ProjectUnitItem
            key={ unit.language.id }
            unit={ unit }
            projectId={ projectId }
            filesToUpload={ allowedFilesToUpload }
          />
        ) ) }
      </Card.Group>
    </div>
  );
};


ProjectUnits.propTypes = {
  languageList: PropTypes.object,
  projectId: PropTypes.string,
  heading: PropTypes.string,
  extensions: PropTypes.array,
  videoProject: PropTypes.object,
  filesToUpload: PropTypes.array, // from redux
  projectUpdated: PropTypes.func, // from redux
  deleteVideoFile: PropTypes.func,
  updateVideoUnit: PropTypes.func,
  updateVideoProject: PropTypes.func,
  updateVideoFile: PropTypes.func,
  deleteManyVideoUnits: PropTypes.func,
  uploadExecute: PropTypes.func,
};


const mapStateToProps = state => ( {
  filesToUpload: state.upload.filesToUpload,
} );


export default compose(
  withFileUpload,
  connect( mapStateToProps, actions ),
  graphql( LANGUAGES_QUERY, { name: 'languageList' } ),
  graphql( VIDEO_PROJECT_QUERY, {
    name: 'videoProject',
    options: props => ( {
      partialRefetch: true,
      variables: {
        id: props.projectId,
      },
    } ),
    skip: props => !props.projectId,
  } ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, { name: 'updateVideoProject' } ),
  graphql( UPDATE_VIDEO_UNIT_MUTATION, { name: 'updateVideoUnit' } ),
  graphql( DELETE_MANY_VIDEO_UNITS_MUTATION, { name: 'deleteManyVideoUnits' } ),
  graphql( DELETE_VIDEO_FILE_MUTATION, { name: 'deleteVideoFile' } ),
  graphql( UPDATE_VIDEO_FILE_MUTATION, { name: 'updateVideoFile' } ),
)( ProjectUnits );
