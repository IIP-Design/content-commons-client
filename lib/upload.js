import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const uploadToVimeo = async file => {
  const res = await axios.post( 'https://api.vimeo.com/me/videos', {
    upload: {
      approach: 'pull',
      size: file.fileObject.size,
      link: `https://s3.amazonaws.com/${publicRuntimeConfig.REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET}/${file.s3Path}`
    }
  }, {
    headers: {
      Authorization: `bearer ${publicRuntimeConfig.REACT_APP_VIMEO_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.vimeo.*+json;version=3.4'
    }
  } ).catch( err => console.dir( err ) );

  return res;
};


export const uploadToS3 = async ( signedUrl, file, onUploadProgress ) => {
  const { fileObject } = file;

  await axios.put( signedUrl, fileObject, {
    headers: {
      'Content-Type': file.contentType
    },
    onUploadProgress: async progressEvent => {
      onUploadProgress( progressEvent, file );
    }
  } ).catch( err => console.dir( err ) );
};
