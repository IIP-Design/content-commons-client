import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import {
  IMAGE_USES_QUERY,
  UPDATE_SUPPORT_FILE_MUTATION,
  UPDATE_IMAGE_FILE_MUTATION,
  DELETE_SUPPORT_FILE_MUTATION,
  DELETE_IMAGE_FILE_MUTATION,
  DELETE_MANY_THUMBNAILS_MUTATION
} from 'lib/graphql/queries/common';
import {
  UPDATE_VIDEO_PROJECT_MUTATION,
  UPDATE_VIDEO_UNIT_MUTATION,
  VIDEO_PROJECT_QUERY
} from 'lib/graphql/queries/video';
import { buildSupportFile, buildImageFile, buildThumbnailTree } from 'lib/graphql/builders/common';
import { getFileExt } from 'lib/utils';
import { searchTreeForS3FileDirectories } from 'lib/upload';
import withFileUpload from 'hocs/withFileUpload/withFileUpload';
import ProjectSupportFiles from '../ProjectSupportFiles';
import { config } from './config';

const VideoProjectSupportFiles = props => {
  const { supportFiles: { types: { srt, other } } } = config;

  const getQuery = ( id, data ) => ( {
    variables: {
      data,
      where: {
        id
      }
    }
  } );

  const hasAcceptedExtension = ext => {
    const allAcceptedExts = [...srt.extensions, ...other.extensions];
    return allAcceptedExts.includes( ext );
  };

  const isSupportFile = name => {
    const ext = getFileExt( name );
    return srt.extensions.includes( ext );
  };


  const updateLanguage = async file => {
    const { updateSupportFile, updateImageFile } = props;

    const qry = getQuery( file.id, {
      language: {
        connect: {
          id: file.language
        }
      }
    } );

    if ( isSupportFile( file.name ) ) {
      return updateSupportFile( qry );
    }

    return updateImageFile( qry );
  };


  const createFile = async file => {
    const { updateVideoProject, projectId, imagesUsesData: { imageUses } } = props;

    if ( isSupportFile( file.name ) ) {
      return updateVideoProject( getQuery( projectId, {
        supportFiles: {
          create: buildSupportFile( file )
        }
      } ) );
    }

    // Set use to thumbnail/cover use
    file.use = imageUses[0].id;

    return updateVideoProject( getQuery( projectId, {
      thumbnails: {
        create: buildImageFile( file )
      }
    } ) );
  };

  const clearUnitThumbnails = async unit => {
    const { deleteManyThumbnails } = props;
    const ids = ( unit.thumbnails.map( tn => tn.id ) );

    if ( ids.length ) {
      return deleteManyThumbnails( {
        variables: {
          where: {
            id_in: ids
          }
        }
      } );
    }
  };

  const addUnitThumbnails = async ( unit, thumbnails ) => {
    const { updateVideoUnit } = props;

    const languageThumbnail = thumbnails.find( tn => tn.language.id === unit.language.id );
    if ( languageThumbnail ) {
      return Promise.all( thumbnails.map( async tn => {
        if ( tn.language.id === unit.language.id ) {
          await updateVideoUnit( {
            variables: {
              data: buildThumbnailTree( tn ),
              where: {
                id: unit.id
              }
            }
          } );
        }
      } ) );
    }
    const englishThumbnail = thumbnails.find( tn => tn.language.id === 'en-us' );
    if ( englishThumbnail ) {
      return updateVideoUnit( {
        variables: {
          data: buildThumbnailTree( englishThumbnail ),
          where: {
            id: unit.id
          }
        }
      } );
    }
  };

  const updateUnitThumbnails = async () => {
    const { data: { project: { units } } } = props;
    const result = await props.data.refetch();
    const { data: { project: { thumbnails } } } = result;

    if ( units.length && thumbnails.length ) {
      units.forEach( async unit => {
        await clearUnitThumbnails( unit );
        await addUnitThumbnails( unit, thumbnails );
      } );

      return props.data.refetch();
    }
  };


  const updateDatabase = async ( files = [] ) => {
    const { projectId, uploadExecute } = props;
    let uploadDir = null;

    return Promise.all( files.map( async file => {
      if ( !hasAcceptedExtension( getFileExt( file.name ) ) ) {
        throw new Error( `File: ${file.name} does not have an accepted support extension for this project` );
      }

      const { data } = props;
      if ( data && data.project ) {
        uploadDir = searchTreeForS3FileDirectories( data.project );
        uploadDir = uploadDir.length ? uploadDir[0] : '';
      }

      // Either use a dir path for existing projects or send projectId to create new dir on S3
      const projectIdPath = uploadDir || projectId;

      // 1. Does a new file need to be upload
      if ( file.input ) {
        try {
          // 1a. Upload file
          await uploadExecute( projectIdPath, [file] );

          // 1b. Create file on the DB if upload is successful
          return createFile( file );
        } catch ( err ) {
          console.error( err );
        }
      }

      // 2. Just update the db is no file need to be uploaded
      return updateLanguage( file );
    } ) );
  };

  const removeFromDataBase = async ( files = [] ) => {
    const { deleteSupportFile, deleteImageFile, } = props;

    // todo: should use delete many so ony have 1 call
    return Promise.all( files.map( async file => {
      if ( isSupportFile( file.name ) ) {
        return deleteSupportFile( { variables: { id: file.id } } ).catch( err => console.dir( err ) );
      }
      return deleteImageFile( { variables: { id: file.id } } ).catch( err => console.dir( err ) );
    } ) );
  };

  const handleSave = async ( files, filesToRemove ) => {
    // Remove files must be executed before adding in the event we are
    // replacing/adding a file with the same filename
    await removeFromDataBase( filesToRemove );
    await updateDatabase( files );
    return updateUnitThumbnails();
  };

  return (
    <ProjectSupportFiles
      { ...props }
      save={ handleSave }
      config={ config.supportFiles }
    />
  );
};

VideoProjectSupportFiles.propTypes = {
  projectId: PropTypes.string,
  updateSupportFile: PropTypes.func,
  deleteSupportFile: PropTypes.func,
  updateImageFile: PropTypes.func,
  deleteImageFile: PropTypes.func,
  updateVideoUnit: PropTypes.func,
  updateVideoProject: PropTypes.func,
  uploadSupportFile: PropTypes.func,
  deleteManyThumbnails: PropTypes.func,
  uploadExecute: PropTypes.func,
  imagesUsesData: PropTypes.object,
  data: PropTypes.object
};


export default compose(
  withFileUpload,
  graphql( IMAGE_USES_QUERY, { name: 'imagesUsesData' } ),
  graphql( DELETE_MANY_THUMBNAILS_MUTATION, { name: 'deleteManyThumbnails' } ),
  graphql( UPDATE_VIDEO_UNIT_MUTATION, { name: 'updateVideoUnit' } ),
  graphql( UPDATE_SUPPORT_FILE_MUTATION, { name: 'updateSupportFile' } ),
  graphql( DELETE_SUPPORT_FILE_MUTATION, { name: 'deleteSupportFile' } ),
  graphql( DELETE_IMAGE_FILE_MUTATION, { name: 'deleteImageFile' } ),
  graphql( UPDATE_IMAGE_FILE_MUTATION, { name: 'updateImageFile' } ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, { name: 'updateVideoProject' } ),
  graphql( VIDEO_PROJECT_QUERY, {
    options: props => ( {
      variables: { id: props.projectId }
    } ),
    skip: props => !props.projectId
  } ),
)( VideoProjectSupportFiles );
