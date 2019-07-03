import axios from 'axios';
import getConfig from 'next/config';
import mime from 'mime-types';

const { publicRuntimeConfig } = getConfig();

const VIMEO_HEADERS = {
  Authorization: `bearer ${publicRuntimeConfig.REACT_APP_VIMEO_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.vimeo.*+json;version=3.4'
};

export const uploadToVimeo = async file => {
  const res = await axios.post( 'https://api.vimeo.com/me/videos', {
    upload: {
      approach: 'pull',
      size: file.input.size,
      link: `https://s3.amazonaws.com/${publicRuntimeConfig.REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET}/${file.s3Path}`
    }
  }, {
    headers: VIMEO_HEADERS
  } ).catch( err => console.dir( err ) );

  return res.data.link;
};

export const uploadToS3 = async ( projectId, file, getSignedS3Url, callback ) => {
  const { input } = file;
  const contentType = input.type ? input.type : mime.lookup( input.name );

  // 1. get signed url from aws
  const res = await getSignedS3Url( {
    variables: {
      contentType,
      filename: input.name,
      projectId
    }
  } ).catch( err => console.dir( err ) );

  const signedUrl = res.data.getSignedS3Url.url;

  // 2. use signed url to upload to s3 directly
  await axios.put( signedUrl, input, {
    headers: {
      'Content-Type': contentType
    },
    onUploadProgress: async progressEvent => {
      callback( progressEvent, file );
    }
  } ).catch( err => console.dir( err ) );

  const result = {
    path: res.data.getSignedS3Url.key,
    contentType
  };

  return result;
};


/**
   * Return file metadata, ie. duration, bitrate, width, height, etc
   * @param {String} path url to publically available file
 */
export const getFileMetadata = async ( getFileInfo, path ) => {
  const res = await getFileInfo( {
    variables: {
      path
    }
  } ).catch( err => console.dir( err ) );

  if ( res && res.data ) {
    const {
      duration, bitrate, width, height
    } = res.data.getFileInfo;

    return {
      duration,
      bitrate,
      width,
      height
    };
  }
  return null;
};
