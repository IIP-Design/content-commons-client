/**
 *
 * ProjectUnits
 *
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Card } from 'semantic-ui-react';
import { getFileExt } from 'lib/utils';
import isEmpty from 'lodash/isEmpty';
import withFileUpload from 'hocs/withFileUpload/withFileUpload';
import { searchTreeForS3FileDirectories } from 'lib/upload';
import { buildVideoFile, buildUnit } from 'lib/graphql/builders/video';
import { LANGUAGES_QUERY } from 'components/admin/dropdowns/LanguageDropdown';
import {
  VIDEO_PROJECT_QUERY,
  DELETE_VIDEO_FILE_MUTATION,
  UPDATE_VIDEO_FILE_MUTATION,
  UPDATE_VIDEO_UNIT_MUTATION,
  DELETE_MANY_VIDEO_UNITS_MUTATION,
  UPDATE_VIDEO_PROJECT_MUTATION,
  CREATE_VIDEO_FILE_MUTATION
} from 'lib/graphql/queries/video';

// renmae this it generic
import EditProjectFiles from '../ProjectEdit/EditProjectFilesModal/EditPojectFilesModal';

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
    heading,
    extensions
  } = props;

  const hasProjectUnits = () => ( !isEmpty( videoProject ) && videoProject.project && videoProject.project.units );
  const hasFilesToUpload = () => ( filesToUpload && filesToUpload.length );

  /**
   * Checks file changes against stored file to see if language has changed
   * @param {object} unit unit that file belongs to
   * @param {object} file possible changed file
   */
  const hasFileLanguageChanged = ( unit, file ) => {
    const found = unit.files.find( f => f.id === file.id );
    if ( found ) {
      return file.language !== found.language.id;
    }
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
        filesToEdit = [...filesToEdit, ...unit.files];
      } );
    }

    return filesToEdit;
  };

  /**
   * Separates files into units and normalizes data structure
   * for consistent renderinig
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
          displayName: props.languageList.languages.find( l => l.id === language ).displayName
        }
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
        id
      }
    }
  } );

  /**
  * We are assumng a single thumbnail per language although the data
  * model can support multiple thumbnails per language (in diff sizes)
  * todo: refactor to to support multiple thumbnails per language
  * @param {*} language language d of file
  */
  const getLanguageThumbnail = language => {
    const { project: { thumbnails } } = videoProject;
    return thumbnails.find( tn => tn.language.id === language );
  };


  /**
   * If file language has changed, disconnect from current language
   * @param {object} unit unit file currently belongs to
   * @param {object} file
   */
  const disconnectFileFromUnit = async ( unit, file ) => updateVideoUnit( getQuery( unit.id, {
    files: {
      disconnect: { id: file.id }
    }
  } ) );

  /**
   * If file language has changed, connect to new language
   * @param {object} unit unit to connect file to
   * @param {object} file
   */
  const connectFileToUnit = async ( unit, file ) => updateVideoUnit( getQuery( unit.id, {
    files: {
      connect: { id: file.id }
    }
  } ) );


  const createUnit = async language => {
    const { project: { projectTitle, tags } } = videoProject;
    const thumbnail = getLanguageThumbnail( language );

    return updateVideoProject( getQuery( projectId, {
      units: {
        create: buildUnit( projectTitle, language, tags, null, thumbnail )
      }
    } ) );
  };

  /**
   * Updates file properties
   * @param {*} file
   */
  const updateFile = async file => updateVideoFile( getQuery( file.id, {
    language: {
      connect: {
        id: file.language
      }
    },
    quality: file.quality,
    videoBurnedInStatus: file.videoBurnedInStatus,
    use: {
      connect: {
        id: file.use
      }
    }
  } ) );

  /**
   * Updates applicable units. If an existing file's language changes, diconnect that file
   * from its existing unit and connect to new unit. Create unit if a unit in the
   * file's new language does not yet exist
   * @param {object} file file to update
   */
  const updateUnit = async file => {
    const unitFileBelongsTo = getFileUnit( file );

    // 1. stored changed status before updating
    const fileLanguageChanged = hasFileLanguageChanged( unitFileBelongsTo, file );

    // 2. if changed, remove from current unit and add to new unit
    if ( fileLanguageChanged ) {
      // a. disconnect from current unit
      await disconnectFileFromUnit( unitFileBelongsTo, file );

      // b. does unit exist for new language?
      let unitOfLanguage = videoProject.project.units.find( u => u.language.id === file.language );

      // i. yes, unit exists, connect file to it
      if ( unitOfLanguage ) {
        return connectFileToUnit( unitOfLanguage, file );
      }

      // ii. no, unit does not exist, create unit and connect file to new unit
      const result = await createUnit( file.language );
      unitOfLanguage = result.data.updateVideoProject.units.find( u => u.language.id === file.language );

      return connectFileToUnit( unitOfLanguage, file );
    }
  };

  const _createFile = async file => {
    const { createVideoFile } = props;
    return createVideoFile( { variables: { data: buildVideoFile( file ) } } );
  };

  /**
   * Create a new file in db and connect to applicable unit. Create unit if it
   * does not already exist
   * @param {object} file
   */
  const createFile = async file => {
    // 1. create the file
    const { data } = await _createFile( file );

    // 2. does language unit exist for the language of the file?
    let unitOfLanguage = videoProject.project.units.find( u => u.language.id === file.language );

    // a. yes, unit exists, connect file to it using the result of createFile as it contains the DB id
    if ( unitOfLanguage ) {
      return connectFileToUnit( unitOfLanguage, data.createVideoFile );
    }

    // a. no, unit does not exist, creat unit then connect file to it using the result of
    // createFile as it contanis the DB id
    const result = await createUnit( file.language );
    unitOfLanguage = result.data.updateVideoProject.units.find( u => u.language.id === file.language );

    return connectFileToUnit( unitOfLanguage, data.createVideoFile );
  };

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
              id_in: unitIds
            }
          }
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

        // if new file use projectId to create new dir on S3, else use exisiting dir
        const projectIdPath = uploadDir || projectId;

        // 3. Upload file
        return uploadExecute( projectIdPath, [file] );
      } catch ( err ) {
        file.error = !!err;
        console.error( err );
      }
    } ) );
  };

  const removeFiles = async files => {
    const { deleteVideoFile } = props;
    return Promise.all( files.map( async file => deleteVideoFile( { variables: { id: file.id } } ) ) );
  };

  /**
   * Main save function
   * @param {array} files
   * @param {array} filesToRemove
   */
  const handleSave = async ( files, filesToRemove ) => {
    // remove files
    await removeFiles( filesToRemove );

    // upload files
    const toUpload = files.filter( file => ( file.input ) );
    await uploadFiles( toUpload ).catch( err => console.log( err ) );

    // create new files
    await Promise.all( toUpload.map( async file => createFile( file ) ) );

    // update existing files
    const toUpdate = files.filter( file => ( !file.input ) );
    await Promise.all( toUpdate.map( file => updateFile( file ) ) );

    // update connect/disconnect files from units
    await Promise.all( toUpdate.map( file => updateUnit( file ) ) );

    // remove units
    const unitsToRemove = [];
    videoProject.project.units.forEach( u => {
      if ( u.files.length === 1 ) {
        const fil = files.filter( f => f.language === u.language.id );
        if ( !fil.length ) {
          unitsToRemove.push( u );
        }
      }
    } );

    await removeUnits( unitsToRemove );

    return props.videoProject.refetch();
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

  const [units, setUnits] = useState( [] );

  useEffect( () => {
    setUnits( fetchUnits( videoProject ) );
  }, [] );

  useEffect( () => {
    if ( hasProjectUnits() ) {
      const { project } = videoProject;
      if ( project && project.units && project.units.length ) {
        setUnits( fetchUnits( videoProject ) );
      }
    }
  }, [videoProject] );


  const renderUnits = () => (
    <Card.Group>
      { units.map( unit => (
        <ProjectUnitItem
          key={ unit.language.id }
          unit={ unit }
          projectId={ projectId }
          filesToUpload={ getAllowedExtensions( filesToUpload ) }
        />
      ) ) }
    </Card.Group>
  );

  return (
    <div className="project-units">
      <h2 className="list-heading" style={ { marginBottom: '1rem' } }>{ heading }
        { projectId
          && (
            <EditProjectFiles
              title="Edit video files in this project"
              type="video"
              filesToEdit={ getFilesToEdit() }
              extensions={ ['.mov', '.mp4'] }
              save={ handleSave }
            />
          )
        }
      </h2>
      { units && units.length
        ? renderUnits( units )
        : 'No units available'
       }
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
  deleteVideoFile: PropTypes.func,
  updateVideoUnit: PropTypes.func,
  updateVideoProject: PropTypes.func,
  updateVideoFile: PropTypes.func,
  createVideoFile: PropTypes.func,
  deleteManyVideoUnits: PropTypes.func,
  uploadExecute: PropTypes.func
};


const mapStateToProps = state => ( {
  filesToUpload: state.upload.filesToUpload
} );


export default compose(
  withFileUpload,
  connect( mapStateToProps ),
  graphql( LANGUAGES_QUERY, { name: 'languageList' } ),
  graphql( VIDEO_PROJECT_QUERY, {
    name: 'videoProject',
    options: props => ( {
      partialRefetch: true,
      variables: {
        id: props.projectId
      }
    } ),
    skip: props => !props.projectId
  } ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, { name: 'updateVideoProject' } ),
  graphql( UPDATE_VIDEO_UNIT_MUTATION, { name: 'updateVideoUnit' } ),
  graphql( DELETE_MANY_VIDEO_UNITS_MUTATION, { name: 'deleteManyVideoUnits' } ),
  graphql( DELETE_VIDEO_FILE_MUTATION, { name: 'deleteVideoFile' } ),
  graphql( UPDATE_VIDEO_FILE_MUTATION, { name: 'updateVideoFile' } ),
  graphql( CREATE_VIDEO_FILE_MUTATION, { name: 'createVideoFile' } )
)( ProjectUnits );
