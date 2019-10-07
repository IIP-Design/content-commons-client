import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';
import {
  buildSupportFileTree,
  buildImageFileTree,
  buildThumbnail
} from './common';

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

export const buildVideoFile = file => {
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
};

export const buildVideoFileTree = files => {
  const tree = files.map( file => buildVideoFile( file ) );
  return tree;
};


const buildTagTree = tags => {
  let tree = {};
  if ( tags && tags.length ) {
    const tagArr = tags.map( tag => ( { id: tag } ) );
    tree = {
      connect: tagArr
    };
  }

  return tree;
};

export const buildUpdateUnit = ( projectTitle, language, tags, files, thumbnail ) => {
  const unit = {
    title: projectTitle,
    language: {
      connect: {
        id: language
      }
    },
    tags: buildTagTree( tags )
  };

  if ( files && files.length ) {
    unit.files = {
      connect: files.map( file => ( { id: file.id } ) )
    };
  }

  if ( thumbnail ) {
    unit.thumbnails = buildThumbnail( thumbnail );
  }

  return unit;
};

export const buildUnit = ( projectTitle, language, tags, thumbnail, files, filesToConnect, filesToDisconnect ) => {
  const unit = {
    title: projectTitle,
    language: {
      connect: {
        id: language
      }
    },
    tags: buildTagTree( tags )
  };

  if ( thumbnail ) {
    unit.thumbnails = buildThumbnail( thumbnail );
  }

  if ( files && files.length ) {
    unit.files = {
      create: buildVideoFileTree( files )
    };
  }

  if ( filesToConnect && filesToConnect.length ) {
    unit.files = {
      connect: filesToConnect.map( file => ( { id: file.id } ) )
    };
  }

  if ( filesToDisconnect && filesToDisconnect.length ) {
    unit.files = {
      disconnect: filesToDisconnect.map( file => ( { id: file.id } ) )
    };
  }

  return unit;
};


export const buildUnitTree = ( units, projectTitle, tags ) => {
  const entries = Object.entries( units );
  const tree = entries.map( entry => {
    const [language, unit] = entry;
    return buildUnit( projectTitle, language, tags, unit.thumbnail, unit.files );
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
        units[file.language] = {};
        units[file.language].files = [];
      }
      units[file.language].files.push( file );
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
