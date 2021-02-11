/* eslint-disable no-console */
import axios from 'axios';
import getConfig from 'next/config';
import mime from 'mime-types';
import { findAllValuesForKey } from 'lib/utils';

const { publicRuntimeConfig } = getConfig();

const VIMEO_HEADERS = {
  Authorization: `bearer ${publicRuntimeConfig.REACT_APP_VIMEO_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.vimeo.*+json;version=3.4',
};

const _getSignedS3Url = async ( variables, mutation ) => mutation( {
  variables,
} ).catch( err => {
  console.dir( err );
} );

export const uploadToVimeo = async ( file, getSignedS3UrlGet ) => {
  // 1. get signed url from aws
  const res = await _getSignedS3Url( {
    key: file.s3Path,
  }, getSignedS3UrlGet );

  const signedUrl = res.data.getSignedS3UrlGet.url;

  const vimeoRes = await axios.post( 'https://api.vimeo.com/me/videos', {
    upload: {
      approach: 'pull',
      size: file.input.size,
      link: signedUrl,
    },
  }, {
    headers: VIMEO_HEADERS,
  } ).catch( err => console.dir( err ) );

  return vimeoRes.data.link;
};

/**
 *
 * @param {string} projectId
 * @param {object|string} file file to upload. Contains input prop which is either a File object or a data url
 * @param {function} getSignedS3UrlPut mutation to fetch signed url
 * @param {fuction} callback function to call to track upload progress
 */
export const uploadToS3 = async ( projectId, file, getSignedS3UrlPut, callback ) => {
  const { input } = file;

  // if data url is present, create an upload buffer
  const fileToUpload = input?.dataUrl
    ? Buffer.from( input.dataUrl.split( ',' )['1'], 'base64' )
    : input;

  const contentType = input.type ? input.type : mime.lookup( input.name );
  let error = false;

  // Remove special characters
  const filename = input?.name.replace( /[&/\\#,+$~%'"`=:;*?^<>@(){}|[\]]/g, '' );

  // 1. get signed url from aws
  const res = await _getSignedS3Url( {
    contentType,
    filename,
    projectId,
  }, getSignedS3UrlPut );

  const signedUrl = res.data.getSignedS3UrlPut.url;

  // 2. use signed url to upload to s3 directly
  await axios
    .put( signedUrl, fileToUpload, {
      headers: {
        'Content-Type': contentType,
        'Content-Encoding': 'base64',
      },
      onUploadProgress: async progressEvent => {
        if ( typeof callback === 'function' ) {
          callback( progressEvent, file ); // eslint-disable-line node/callback-return
        }
      },
    } )
    .catch( err => {
      console.dir( err );
      error = err.isAxiosError;
    } );

  const result = {
    error,
    path: res.data.getSignedS3UrlPut.key,
    contentType,
  };

  return result;
};


/**
   * Return file metadata, ie. duration, bitrate, width, height, etc
   * @param {String} path url to publically available file
 */
export const getFileMetadata = async ( getFileInfo, path ) => { // encodeURI?
  const res = await getFileInfo( {
    variables: {
      path,
    },
  } ).catch( err => console.dir( err ) );

  if ( res && res.data ) {
    const {
      duration, bitrate, width, height,
    } = res.data.getFileInfo;

    return {
      duration,
      bitrate,
      width,
      height,
    };
  }

  return null;
};

/**
 * Takes an object and searchs for all urls. Excludes any that have a http as
 * that is indicative of a vimeo or youtube file. Extracts only the path (removes filename)
 * and returns an array of unique paths
 * @param {object} tree Object to parse for filenames
 */
export const searchTreeForS3FileDirectories = tree => {
  const urls = findAllValuesForKey( tree, 'url' )
    .filter( url => url && url.indexOf( 'http' ) === -1 ) // remove any non S3 paths, i.e. vimeo or youtube
    .map( url => url.substr( 0, url.lastIndexOf( '/' ) ) ); // remove filename

  // return only unique paths (should only return 1 path, if more exist then files are in different directories on S3)
  return urls.length ? [...new Set( urls )] : [];
};
