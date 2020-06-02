/* eslint-disable no-console */
import { useMutation } from '@apollo/react-hooks';
import { uploadToS3, uploadToVimeo, getFileMetadata } from 'lib/upload';
import {
  SIGNED_S3_URL_PUT_MUTATION,
  SIGNED_S3_URL_GET_MUTATION,
  FILE_INFO_MUTATION,
} from 'lib/graphql/queries/util';

// do not want to process filemeta data, i.e. width/height for psd/ai, etc
const isImage = contentType => {
  const re = /image\//;

  if ( re.test( contentType ) ) {
    return !contentType.includes( 'photoshop' );
  }

  return false;
};

/**
 * Uploads single or multiple files to S3
 */
export const useFileUpload = () => {
  const [getSignedS3UrlPut] = useMutation( SIGNED_S3_URL_PUT_MUTATION );
  const [getSignedS3UrlGet] = useMutation( SIGNED_S3_URL_GET_MUTATION );
  const [getFileInfo] = useMutation( FILE_INFO_MUTATION );

  const uploadFile = async ( projectId, file, callback, updateFn ) => {
    let result = await uploadToS3( projectId, file, getSignedS3UrlPut, callback ).catch( err => {
      file.error = !!err;
    } );

    // if successful upload to s3
    if ( !file.error ) {
      const { contentType, path } = result;

      file.contentType = contentType;
      file.s3Path = path;

      const isVideo = contentType.includes( 'video' );

      if ( isVideo ) {
        file.stream = {};
        file.stream.vimeo = await uploadToVimeo( file, getSignedS3UrlGet ).catch( err => {
          console.dir( err );
          file.error = !!err;
        } );
      }

      //  if video or image, fetch file metadata (this call takes a bit long so may need to fix)
      if ( isVideo || isImage( contentType ) ) {
        result = await getFileMetadata( getFileInfo, encodeURI( file.s3Path ) ).catch( err => {
          console.dir( err );
        } );

        if ( result ) {
          const { duration, bitrate, width, height } = result;

          file.duration = duration;
          file.bitrate = bitrate;
          file.width = width;
          file.height = height;
        }
      }

      // update reducer state with new file props
      if ( updateFn && typeof updateFn === 'function' ) {
        updateFn( file );
      }
    }

    return file;
  };

  const uploadAllFiles = async ( projectId, files, callback, updateFn ) => Promise.all( files.map( async file => uploadFile( projectId, file, callback, updateFn ) ) );

  return {
    uploadFile,
    uploadAllFiles,
  };
};
