import isEmpty from 'lodash/isEmpty';
import { buildSupportFileTree, buildImageFileTree } from './shared';

const buildStreamTree = stream => {
  if ( !stream ) {
    return null;
  }

  const entries = Object.entries( stream );
  const tree = entries.map( entry => {
    const [site, url] = entry;
    return ( {
      site,
      url
    } );
  } );

  return tree;
};

const buildFileTree = files => {
  const tree = files.map( file => {
    const { fileObject } = file;
    return ( {
      filename: fileObject.name,
      filesize: fileObject.size,
      filetype: file.contentType,
      quality: file.quality,
      duration: file.duration,
      bitrate: file.bitrate,
      dimensions: {
        create: {
          width: file.width,
          height: file.height,
        }
      },
      videoBurnedInStatus: file.videoBurnedInStatus,
      use: {
        connect: {
          id: file.use
        }
      },
      url: file.s3Path,
      language: {
        connect: {
          id: file.language
        }
      },
      stream: {
        create: buildStreamTree( file.stream )
      }
    } );
  } );

  return tree;
};


const buildUnitTree = ( units, projectTitle ) => {
  const entries = Object.entries( units );
  const tree = entries.map( entry => {
    const [language, files] = entry;
    return ( {
      title: projectTitle,
      language: {
        connect: {
          id: language
        }
      },
      files: {
        create: buildFileTree( files )
      }
    } );
  } );

  return tree;
};

export const buildUpdateVideoProjectData = ( files, thumbnailUseId, projectTitle ) => {
  const data = {};
  const supportFiles = [];
  const thumbnails = [];
  const units = {};

  files.forEach( file => {
    if ( file.contentType.includes( 'video' ) ) {
      if ( !units[file.language] ) {
        units[file.language] = [];
      }
      units[file.language].push( file );
    } else if ( file.contentType.includes( 'image' ) ) {
      if ( file.use === thumbnailUseId ) {
        thumbnails.push( file );
      } else {
        supportFiles.push( file );
      }
    } else {
      supportFiles.push( file );
    }
  } );

  if ( supportFiles.length ) {
    data.supportFiles = {
      create: buildSupportFileTree( supportFiles )
    };
  }

  if ( thumbnails.length ) {
    data.thumbnails = {
      create: buildImageFileTree( thumbnails )
    };
  }

  if ( !isEmpty( units ) ) {
    data.units = {
      create: buildUnitTree( units, projectTitle )
    };
  }

  return data;
};
