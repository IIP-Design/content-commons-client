import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';
import { buildSupportFileTree, buildImageFileTree } from './common';

const buildStreamTree = stream => {
  if ( !stream ) {
    return null;
  }

  const entries = Object.entries( stream );
  const tree = entries.map( entry => {
    const [site, url] = entry;
    return {
      site,
      url
    };
  } );

  return tree;
};

const buildFileTree = files => {
  const tree = files.map( file => {
    const { input } = file;
    return {
      filename: input.name,
      filesize: input.size,
      filetype: file.contentType,
      quality: file.quality,
      duration: file.duration,
      bitrate: file.bitrate,
      dimensions: {
        create: {
          width: file.width,
          height: file.height
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
    };
  } );

  return tree;
};

const buildTagTree = tags => {
  let tree = {};
  if ( tags.length ) {
    const tagArr = tags.map( tag => ( { id: tag } ) );
    tree = {
      connect: tagArr
    };
  }

  return tree;
};

const buildUnitTree = ( units, projectTitle, tags ) => {
  const entries = Object.entries( units );
  const tree = entries.map( entry => {
    const [language, files] = entry;
    return {
      title: projectTitle,
      language: {
        connect: {
          id: language
        }
      },
      files: {
        create: buildFileTree( files )
      },
      tags: buildTagTree( tags )
    };
  } );

  return tree;
};

const buildConnectionTree = ( values, prevValues = [] ) => {
  const valuesToDisconnect = difference( prevValues, values );
  const tree = {};
  if ( valuesToDisconnect.length ) {
    tree.disconnect = valuesToDisconnect.map( value => ( { id: value } ) );
  }

  if ( values.length ) {
    tree.connect = values.map( value => ( { id: value } ) );
  }

  return tree;
};

export const buildFormTree = ( values, prevValues = {} ) => {
  const prevCategories = prevValues.categories ? prevValues.categories : [];
  const prevTags = prevValues.tags ? prevValues.tags : [];

  const tree = {
    projectTitle: values.projectTitle.trimEnd(),
    descPublic: values.descPublic.trimEnd(),
    descInternal: values.descInternal.trimEnd(),
    visibility: values.visibility,
    author: {
      connect: {
        id: values.author
      }
    },
    categories: buildConnectionTree( values.categories, prevCategories ),
    tags: buildConnectionTree( values.tags, prevTags )
  };
  return tree;
};

export const buildUpdateVideoProjectTree = (
  files,
  thumbnailUseId,
  projectTitle,
  tags
) => {
  const tree = {};
  const supportFiles = [];
  const thumbnails = [];
  const units = {};

  files.forEach( file => {
    if ( file.contentType.includes( 'video' ) ) {
      // separate video files by language unit
      if ( !units[file.language] ) {
        units[file.language] = [];
      }
      units[file.language].push( file );
    } else if ( file.contentType.includes( 'image' ) ) {
      // if image file has thumbnail use, put it in thumbnail array, else support
      if ( file.use === thumbnailUseId ) {
        thumbnails.push( file );
      } else {
        supportFiles.push( file );
      }
    } else {
      // all other file types put in support array
      supportFiles.push( file );
    }
  } );

  if ( supportFiles.length ) {
    tree.supportFiles = {
      create: buildSupportFileTree( supportFiles )
    };
  }

  if ( thumbnails.length ) {
    tree.thumbnails = {
      create: buildImageFileTree( thumbnails )
    };
  }

  if ( !isEmpty( units ) ) {
    tree.units = {
      create: buildUnitTree( units, projectTitle, tags )
    };
  }

  return tree;
};

export const buildCreateVideoProjectTree = ( user, values ) => {
  const formTree = buildFormTree( values );
  const tree = {
    ...formTree,
    team: {
      connect: {
        id: user.authenticatedUser.team.id
      }
    }
  };

  return tree;
};
